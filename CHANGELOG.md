# Change Log

All notable changes to the "Nagari Language Support" extension will be documented in this file.

## [0.1.0] - 2025-07-11

### Added
- **Initial release** of Nagari Language Support for VS Code
- **Comprehensive syntax highlighting** for `.nag` files
  - Python-like syntax support with indentation-based structure
  - Keywords, functions, classes, strings, comments highlighting
  - F-string and JSX syntax support
  - Type annotations and decorators
- **Language Server Protocol (LSP) integration**
  - Real-time error checking and diagnostics
  - Code completion and IntelliSense
  - Symbol navigation (Go to Definition, Find References)
- **Integrated commands**
  - Run Nagari files (`Ctrl+F5`)
  - Build Nagari projects
  - Transpile to JavaScript
  - Start interactive REPL
- **Code snippets** for common patterns
  - Function and class definitions
  - Control structures
  - List/dict comprehensions
  - React components and hooks
  - Express route handlers
  - And 20+ more snippets
- **Language configuration**
  - Auto-indentation for Python-like syntax
  - Bracket matching and auto-closing
  - Comment toggling with `#` syntax
  - Code folding support
- **Task integration**
  - Built-in tasks for run, build, and transpile
  - VS Code task system integration
- **Debug support**
  - Debug configuration for Nagari files
  - Source map support
- **Configuration options**
  - Nagari executable path
  - LSP server settings
  - Transpilation targets
  - Format on save
  - Build optimization
- **File type support**
  - `.nag` file association
  - Custom file icons (light/dark themes)

### Technical Details
- Built with TypeScript for type safety
- Uses vscode-languageclient for LSP integration
- Comprehensive TextMate grammar for syntax highlighting
- Supports VS Code 1.102.0+

---

## Release Notes

### 0.1.0
This is the initial release of Nagari Language Support for VS Code, providing comprehensive development tools for the Nagari programming language.

**What's New:**
- Complete syntax highlighting for Nagari's Python-inspired syntax
- Integration with Nagari's Language Server Protocol
- Built-in commands for running, building, and transpiling Nagari code
- 20+ code snippets for common patterns
- Debug support and task integration
- Configurable settings for development workflow

**Next Steps:**
- Install the [Nagari compiler](https://github.com/ayanalamMOON/Nagari)
- Create a `.nag` file and start coding!
- Use `Ctrl+F5` to run your Nagari programs

For installation instructions and documentation, see the [README](./README.md).

---

**Enjoy coding with Nagari! 🚀**
