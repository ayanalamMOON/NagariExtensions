<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Nagari Language VS Code Extension

This is a VS Code extension project for the Nagari programming language. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

## Project Context

Nagari is a Python-inspired programming language that transpiles to JavaScript. Key features:
- Python-like syntax with indentation-based structure
- Transpiles to clean, readable JavaScript
- Complete toolchain with CLI, REPL, LSP, and debugging tools
- Type system with intelligent inference
- Async/await, generators, pattern matching
- Seamless JavaScript ecosystem integration

## Extension Goals

This extension provides comprehensive language support including:
- Syntax highlighting for .nag files
- Language Server Protocol (LSP) integration
- Code completion and IntelliSense
- Debugging support
- Integration with Nagari CLI tools (run, build, transpile)
- Snippets for common patterns
- File icons and theme support

## Development Guidelines

- Follow VS Code extension best practices
- Use TypeScript for type safety
- Implement proper error handling
- Provide clear user feedback
- Support both development and production workflows
- Integrate with existing Nagari toolchain
