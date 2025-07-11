"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    console.log('Nagari Language Support extension is now active!');
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
}
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
function registerCommands(context) {
    // Run Nagari file command
    const runCommand = vscode.commands.registerCommand('nagari.run', async (uri) => {
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
    const transpileCommand = vscode.commands.registerCommand('nagari.transpile', async (uri) => {
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
function startLanguageServer(context) {
    const config = vscode.workspace.getConfiguration('nagari');
    const nagariExecutable = config.get('executable.path', 'nag');
    const lspPort = config.get('lsp.port', 0);
    let serverOptions;
    if (lspPort > 0) {
        // TCP connection
        serverOptions = {
            run: { command: nagariExecutable, args: ['lsp', '--mode', 'tcp', '--port', lspPort.toString()] },
            debug: { command: nagariExecutable, args: ['lsp', '--mode', 'tcp', '--port', lspPort.toString()] }
        };
    }
    else {
        // stdio connection
        serverOptions = {
            run: { command: nagariExecutable, args: ['lsp', '--mode', 'stdio'] },
            debug: { command: nagariExecutable, args: ['lsp', '--mode', 'stdio'] }
        };
    }
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'nagari' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.nag')
        }
    };
    client = new node_1.LanguageClient('nagariLanguageServer', 'Nagari Language Server', serverOptions, clientOptions);
    client.start();
    context.subscriptions.push(client);
}
function registerFormatOnSave(context) {
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
function registerTaskProvider(context) {
    const taskProvider = vscode.tasks.registerTaskProvider('nagari', {
        provideTasks() {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                return [];
            }
            const config = vscode.workspace.getConfiguration('nagari');
            const nagariExecutable = config.get('executable.path', 'nag');
            const tasks = [];
            // Run task
            const runTask = new vscode.Task({ type: 'nagari', task: 'run' }, workspaceFolder, 'Run Nagari File', 'nagari', new vscode.ShellExecution(`${nagariExecutable} run \${file}`));
            runTask.group = vscode.TaskGroup.Build;
            tasks.push(runTask);
            // Build task
            const buildTask = new vscode.Task({ type: 'nagari', task: 'build' }, workspaceFolder, 'Build Nagari Project', 'nagari', new vscode.ShellExecution(`${nagariExecutable} build`));
            buildTask.group = vscode.TaskGroup.Build;
            tasks.push(buildTask);
            // Transpile task
            const transpileTask = new vscode.Task({ type: 'nagari', task: 'transpile' }, workspaceFolder, 'Transpile to JavaScript', 'nagari', new vscode.ShellExecution(`${nagariExecutable} transpile \${file}`));
            transpileTask.group = vscode.TaskGroup.Build;
            tasks.push(transpileTask);
            return tasks;
        },
        resolveTask(task) {
            return task;
        }
    });
    context.subscriptions.push(taskProvider);
}
// Utility function to check if Nagari is installed
async function checkNagariInstallation() {
    const config = vscode.workspace.getConfiguration('nagari');
    const nagariExecutable = config.get('executable.path', 'nag');
    try {
        const result = await vscode.workspace.fs.stat(vscode.Uri.file(nagariExecutable));
        return true;
    }
    catch {
        try {
            // Try to run nagari --version to check if it's in PATH
            const terminal = vscode.window.createTerminal('Nagari Check');
            terminal.sendText(`${nagariExecutable} --version`);
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=extension.js.map