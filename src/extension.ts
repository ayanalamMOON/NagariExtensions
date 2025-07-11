import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

let client: LanguageClient;
let outputChannel: vscode.OutputChannel;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('Nagari Language Support extension is now active!');

    // Initialize output channel and status bar
    outputChannel = vscode.window.createOutputChannel('Nagari');
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = "$(code) Nagari";
    statusBarItem.tooltip = "Nagari Language Support";
    statusBarItem.show();

    // Check Nagari installation
    checkNagariInstallation().then(isInstalled => {
        if (!isInstalled) {
            vscode.window.showWarningMessage(
                'Nagari executable not found. Please install Nagari or configure the path in settings.',
                'Open Settings'
            ).then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'nagari.executable.path');
                }
            });
        } else {
            statusBarItem.text = "$(check) Nagari Ready";
        }
    });

    // Register commands
    registerCommands(context);

    // Start LSP client if enabled
    const config = vscode.workspace.getConfiguration('nagari');
    if (config.get('lsp.enabled', true)) {
        startLanguageServer(context);
    }

    // Register format on save
    if (config.get('format.onSave', true)) {
        registerFormatOnSave(context);
    }

    // Register task provider
    registerTaskProvider(context);

    // Register additional features
    registerFileWatchers(context);
    registerDocumentFormatting(context);
    registerCodeActions(context);
    registerProjectTemplates(context);

    // Auto-start REPL if configured
    if (config.get('repl.autoStart', false)) {
        setTimeout(() => {
            vscode.commands.executeCommand('nagari.startRepl');
        }, 2000); // Delay to let workspace initialize
    }

    // Add to subscriptions
    context.subscriptions.push(outputChannel, statusBarItem);
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

function registerCommands(context: vscode.ExtensionContext) {
    // Run Nagari file command
    const runCommand = vscode.commands.registerCommand('nagari.run', async (uri?: vscode.Uri) => {
        const filePath = uri?.fsPath || vscode.window.activeTextEditor?.document.fileName;
        if (!filePath || !filePath.endsWith('.nag')) {
            vscode.window.showErrorMessage('Please select a .nag file to run');
            return;
        }

        const config = vscode.workspace.getConfiguration('nagari');
        const nagariExecutable = config.get('executable.path', 'nag');

        const terminal = vscode.window.createTerminal('Nagari');
        terminal.show();
        terminal.sendText(`${nagariExecutable} run "${filePath}"`);
    });

    // Build Nagari project command
    const buildCommand = vscode.commands.registerCommand('nagari.build', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const config = vscode.workspace.getConfiguration('nagari');
        const nagariExecutable = config.get('executable.path', 'nag');
        const target = config.get('transpile.target', 'browser');
        const optimize = config.get('build.optimize', false);

        const terminal = vscode.window.createTerminal('Nagari Build');
        terminal.show();

        let buildCommand = `${nagariExecutable} build --target ${target}`;
        if (optimize) {
            buildCommand += ' --optimize';
        }

        terminal.sendText(`cd "${workspaceFolder.uri.fsPath}" && ${buildCommand}`);
    });

    // Transpile to JavaScript command
    const transpileCommand = vscode.commands.registerCommand('nagari.transpile', async (uri?: vscode.Uri) => {
        const filePath = uri?.fsPath || vscode.window.activeTextEditor?.document.fileName;
        if (!filePath || !filePath.endsWith('.nag')) {
            vscode.window.showErrorMessage('Please select a .nag file to transpile');
            return;
        }

        const config = vscode.workspace.getConfiguration('nagari');
        const nagariExecutable = config.get('executable.path', 'nag');
        const target = config.get('transpile.target', 'browser');

        const outputPath = filePath.replace('.nag', '.js');

        const terminal = vscode.window.createTerminal('Nagari Transpile');
        terminal.show();
        terminal.sendText(`${nagariExecutable} transpile "${filePath}" --output "${outputPath}" --target ${target}`);
    });

    // Start REPL command
    const replCommand = vscode.commands.registerCommand('nagari.startRepl', async () => {
        const config = vscode.workspace.getConfiguration('nagari');
        const nagariExecutable = config.get('executable.path', 'nag');

        const terminal = vscode.window.createTerminal('Nagari REPL');
        terminal.show();
        terminal.sendText(`${nagariExecutable} repl --enhanced`);
    });

    context.subscriptions.push(runCommand, buildCommand, transpileCommand, replCommand);
}

function startLanguageServer(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('nagari');
    const nagariExecutable = config.get('executable.path', 'nag');
    const lspPort = config.get('lsp.port', 0);

    let serverOptions: ServerOptions;

    if (lspPort > 0) {
        // TCP connection
        serverOptions = {
            run: { command: nagariExecutable, args: ['lsp', '--mode', 'tcp', '--port', lspPort.toString()] },
            debug: { command: nagariExecutable, args: ['lsp', '--mode', 'tcp', '--port', lspPort.toString()] }
        };
    } else {
        // stdio connection
        serverOptions = {
            run: { command: nagariExecutable, args: ['lsp', '--mode', 'stdio'] },
            debug: { command: nagariExecutable, args: ['lsp', '--mode', 'stdio'] }
        };
    }

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'nagari' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.nag')
        }
    };

    client = new LanguageClient(
        'nagariLanguageServer',
        'Nagari Language Server',
        serverOptions,
        clientOptions
    );

    client.start();
    context.subscriptions.push(client);
}

function registerFormatOnSave(context: vscode.ExtensionContext) {
    const formatOnSave = vscode.workspace.onWillSaveTextDocument(async (event) => {
        if (event.document.languageId === 'nagari') {
            const config = vscode.workspace.getConfiguration('nagari');
            if (config.get('format.onSave', true)) {
                const nagariExecutable = config.get('executable.path', 'nag');

                // Save the document first
                await event.document.save();

                // Format the file
                const terminal = vscode.window.createTerminal('Nagari Format');
                terminal.sendText(`${nagariExecutable} format "${event.document.fileName}"`);
            }
        }
    });

    context.subscriptions.push(formatOnSave);
}

function registerTaskProvider(context: vscode.ExtensionContext) {
    const taskProvider = vscode.tasks.registerTaskProvider('nagari', {
        provideTasks() {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                return [];
            }

            const config = vscode.workspace.getConfiguration('nagari');
            const nagariExecutable = config.get('executable.path', 'nag');

            const tasks: vscode.Task[] = [];

            // Run task
            const runTask = new vscode.Task(
                { type: 'nagari', task: 'run' },
                workspaceFolder,
                'Run Nagari File',
                'nagari',
                new vscode.ShellExecution(`${nagariExecutable} run \${file}`)
            );
            runTask.group = vscode.TaskGroup.Build;
            tasks.push(runTask);

            // Build task
            const buildTask = new vscode.Task(
                { type: 'nagari', task: 'build' },
                workspaceFolder,
                'Build Nagari Project',
                'nagari',
                new vscode.ShellExecution(`${nagariExecutable} build`)
            );
            buildTask.group = vscode.TaskGroup.Build;
            tasks.push(buildTask);

            // Transpile task
            const transpileTask = new vscode.Task(
                { type: 'nagari', task: 'transpile' },
                workspaceFolder,
                'Transpile to JavaScript',
                'nagari',
                new vscode.ShellExecution(`${nagariExecutable} transpile \${file}`)
            );
            transpileTask.group = vscode.TaskGroup.Build;
            tasks.push(transpileTask);

            return tasks;
        },
        resolveTask(task: vscode.Task) {
            return task;
        }
    });

    context.subscriptions.push(taskProvider);
}

// Utility function to check if Nagari is installed
async function checkNagariInstallation(): Promise<boolean> {
    const config = vscode.workspace.getConfiguration('nagari');
    const nagariExecutable = config.get('executable.path', 'nag');

    try {
        const result = await vscode.workspace.fs.stat(vscode.Uri.file(nagariExecutable));
        return true;
    } catch {
        try {
            // Try to run nagari --version to check if it's in PATH
            const terminal = vscode.window.createTerminal('Nagari Check');
            terminal.sendText(`${nagariExecutable} --version`);
            return true;
        } catch {
            return false;
        }
    }
}

// Register file watchers for enhanced development experience
function registerFileWatchers(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('nagari');

    if (config.get('development.watchMode', false)) {
        const watcher = vscode.workspace.createFileSystemWatcher('**/*.nag');

        watcher.onDidChange(async (uri) => {
            if (config.get('output.showTranspiledCode', false)) {
                await vscode.commands.executeCommand('nagari.transpile', uri);
            }
        });

        context.subscriptions.push(watcher);
    }
}

// Register document formatting provider
function registerDocumentFormatting(context: vscode.ExtensionContext) {
    const formatter = vscode.languages.registerDocumentFormattingEditProvider('nagari', {
        async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
            const config = vscode.workspace.getConfiguration('nagari');
            const nagariExecutable = config.get('executable.path', 'nag');

            // For now, return empty array. In a real implementation,
            // this would call the Nagari formatter and return the edits
            outputChannel.appendLine(`Formatting ${document.fileName}`);
            return [];
        }
    });

    context.subscriptions.push(formatter);
}

// Register code actions for quick fixes
function registerCodeActions(context: vscode.ExtensionContext) {
    const codeActionProvider = vscode.languages.registerCodeActionsProvider('nagari', {
        provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection): vscode.CodeAction[] {
            const actions: vscode.CodeAction[] = [];

            // Add quick action to run current file
            const runAction = new vscode.CodeAction('Run Nagari File', vscode.CodeActionKind.QuickFix);
            runAction.command = {
                command: 'nagari.run',
                title: 'Run Nagari File',
                arguments: [document.uri]
            };
            actions.push(runAction);

            // Add quick action to transpile current file
            const transpileAction = new vscode.CodeAction('Transpile to JavaScript', vscode.CodeActionKind.QuickFix);
            transpileAction.command = {
                command: 'nagari.transpile',
                title: 'Transpile to JavaScript',
                arguments: [document.uri]
            };
            actions.push(transpileAction);

            return actions;
        }
    });

    context.subscriptions.push(codeActionProvider);
}

// Register project template commands
function registerProjectTemplates(context: vscode.ExtensionContext) {
    const createProjectCommand = vscode.commands.registerCommand('nagari.createProject', async () => {
        const projectTypes = [
            { label: 'Web Application', detail: 'Create a Nagari web application project' },
            { label: 'Node.js Application', detail: 'Create a Nagari Node.js application project' },
            { label: 'Library', detail: 'Create a Nagari library project' },
            { label: 'Basic Project', detail: 'Create a basic Nagari project' }
        ];

        const selection = await vscode.window.showQuickPick(projectTypes, {
            placeHolder: 'Select project type'
        });

        if (selection) {
            const folderUris = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                openLabel: 'Select Project Location'
            });

            if (folderUris && folderUris[0]) {
                const projectName = await vscode.window.showInputBox({
                    prompt: 'Enter project name',
                    validateInput: (value) => {
                        if (!value || value.trim().length === 0) {
                            return 'Project name cannot be empty';
                        }
                        return null;
                    }
                });

                if (projectName) {
                    await createNagariProject(folderUris[0].fsPath, projectName, selection.label);
                }
            }
        }
    });

    const newFileCommand = vscode.commands.registerCommand('nagari.newFile', async () => {
        const fileName = await vscode.window.showInputBox({
            prompt: 'Enter file name (without .nag extension)',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'File name cannot be empty';
                }
                if (value.includes('/') || value.includes('\\')) {
                    return 'File name cannot contain path separators';
                }
                return null;
            }
        });

        if (fileName) {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (workspaceFolder) {
                const filePath = path.join(workspaceFolder.uri.fsPath, `${fileName}.nag`);
                const template = getFileTemplate();

                fs.writeFileSync(filePath, template);
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document);
            }
        }
    });

    context.subscriptions.push(createProjectCommand, newFileCommand);
}

// Create a new Nagari project with templates
async function createNagariProject(location: string, name: string, type: string) {
    const projectPath = path.join(location, name);

    try {
        // Create project directory
        fs.mkdirSync(projectPath, { recursive: true });

        // Create basic project structure
        const template = getProjectTemplate(type, name);

        for (const [filePath, content] of Object.entries(template)) {
            const fullPath = path.join(projectPath, filePath);
            const dir = path.dirname(fullPath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(fullPath, content);
        }

        outputChannel.appendLine(`Created ${type} project: ${name}`);

        // Open the project
        const uri = vscode.Uri.file(projectPath);
        await vscode.commands.executeCommand('vscode.openFolder', uri);

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create project: ${error}`);
    }
}

// Get project template based on type
function getProjectTemplate(type: string, name: string): Record<string, string> {
    const templates: Record<string, Record<string, string>> = {
        'Web Application': {
            'main.nag': getWebAppTemplate(name),
            'package.json': getPackageJsonTemplate(name, 'web'),
            'index.html': getIndexHtmlTemplate(name),
            'styles/main.css': getCssTemplate(),
            'README.md': getReadmeTemplate(name, 'web application')
        },
        'Node.js Application': {
            'main.nag': getNodeAppTemplate(name),
            'package.json': getPackageJsonTemplate(name, 'node'),
            'README.md': getReadmeTemplate(name, 'Node.js application')
        },
        'Library': {
            'src/index.nag': getLibraryTemplate(name),
            'package.json': getPackageJsonTemplate(name, 'library'),
            'README.md': getReadmeTemplate(name, 'library'),
            'examples/usage.nag': getExampleTemplate(name)
        },
        'Basic Project': {
            'main.nag': getBasicTemplate(name),
            'README.md': getReadmeTemplate(name, 'basic project')
        }
    };

    return templates[type] || templates['Basic Project'];
}

// Template functions
function getFileTemplate(): string {
    return `# Nagari File
# Created on ${new Date().toDateString()}

def main():
    print("Hello, Nagari!")

if __name__ == "__main__":
    main()
`;
}

function getWebAppTemplate(name: string): string {
    return `# ${name} - Web Application
# Nagari web application main file

from browser import document, window

def init_app():
    """Initialize the web application"""
    container = document.getElementById("app")
    if container:
        container.innerHTML = "<h1>Welcome to ${name}!</h1>"
        container.innerHTML += "<p>This is a Nagari web application.</p>"

def handle_click(event):
    """Handle button click events"""
    window.alert("Button clicked!")

def main():
    """Main application entry point"""
    # Wait for DOM to be ready
    window.addEventListener("DOMContentLoaded", init_app)

if __name__ == "__main__":
    main()
`;
}

function getNodeAppTemplate(name: string): string {
    return `# ${name} - Node.js Application
# Nagari Node.js application main file

import os
import sys

def main():
    """Main application entry point"""
    print(f"Starting ${name}...")
    print(f"Node.js version: {process.version}")
    print(f"Platform: {os.platform()}")

    # Your application logic here
    print("Application running successfully!")

if __name__ == "__main__":
    main()
`;
}

function getLibraryTemplate(name: string): string {
    return `# ${name} Library
# A Nagari library for awesome functionality

class ${name}:
    """Main library class"""

    def __init__(self):
        self.version = "1.0.0"

    def greet(self, name: str) -> str:
        """Greet someone with a friendly message"""
        return f"Hello, {name}! Welcome to ${name} library."

    def process_data(self, data):
        """Process some data and return results"""
        # Implementation here
        return data

# Export main functionality
def create_instance():
    """Create a new instance of the library"""
    return ${name}()

# Version information
__version__ = "1.0.0"
__author__ = "Your Name"
`;
}

function getBasicTemplate(name: string): string {
    return `# ${name}
# A basic Nagari project

def greet(name: str = "World") -> str:
    """Return a greeting message"""
    return f"Hello, {name}!"

def main():
    """Main function"""
    message = greet("Nagari")
    print(message)

if __name__ == "__main__":
    main()
`;
}

function getExampleTemplate(name: string): string {
    return `# Example usage of ${name} library

from ..src.index import create_instance

def main():
    """Demonstrate library usage"""
    lib = create_instance()

    # Example 1: Greeting
    greeting = lib.greet("Developer")
    print(greeting)

    # Example 2: Process data
    sample_data = [1, 2, 3, 4, 5]
    result = lib.process_data(sample_data)
    print(f"Processed data: {result}")

if __name__ == "__main__":
    main()
`;
}

function getPackageJsonTemplate(name: string, type: string): string {
    return JSON.stringify({
        name: name.toLowerCase().replace(/\s+/g, '-'),
        version: "1.0.0",
        description: `A ${type} project built with Nagari`,
        main: type === 'library' ? "src/index.nag" : "main.nag",
        scripts: {
            start: "nag run main.nag",
            build: "nag build",
            test: "nag test"
        },
        keywords: ["nagari", type],
        author: "Your Name",
        license: "MIT"
    }, null, 2);
}

function getIndexHtmlTemplate(name: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <div id="app">
        <div class="loading">Loading ${name}...</div>
    </div>
    <script type="module" src="main.js"></script>
</body>
</html>
`;
}

function getCssTemplate(): string {
    return `/* Main styles for the application */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.loading {
    text-align: center;
    padding: 2rem;
    color: #666;
}

button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

button:hover {
    background: #0056b3;
}
`;
}

function getReadmeTemplate(name: string, type: string): string {
    return `# ${name}

A ${type} built with the Nagari programming language.

## Getting Started

### Prerequisites

- Nagari compiler installed
- Node.js (for web projects)

### Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies: \`npm install\` (if applicable)

### Running the Project

\`\`\`bash
nag run main.nag
\`\`\`

### Building for Production

\`\`\`bash
nag build
\`\`\`

## Project Structure

- \`main.nag\` - Main application file
- \`package.json\` - Project configuration
- \`README.md\` - This file

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
`;
}
