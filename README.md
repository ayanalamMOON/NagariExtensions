# Nagari Language Support for VS Code

Comprehensive language support for the [Nagari programming language](https://github.com/ayanalamMOON/Nagari) in Visual Studio Code.

## Features

### 🎨 Syntax Highlighting
- Complete syntax highlighting for `.nag` files
- Support for Python-like syntax with indentation-based structure
- Highlighting for keywords, functions, classes, strings, comments, and more
- Special support for f-strings and JSX syntax
- Type annotations and decorators highlighting

### 🔧 Language Features
- **Auto-completion** with IntelliSense
- **Code navigation** (Go to Definition, Find References)
- **Error detection** and diagnostics
- **Auto-indentation** for Python-like syntax
- **Code folding** support
- **Bracket matching** and auto-closing
- **Comment toggling** with `#` syntax

### 🚀 Integrated Commands
- **Run Nagari File** (`Ctrl+F5`) - Execute `.nag` files directly
- **Build Project** - Build entire Nagari projects
- **Transpile to JavaScript** - Convert Nagari code to JS
- **Start REPL** - Launch interactive Nagari REPL

### 📝 Code Snippets
Pre-built snippets for common Nagari patterns:
- Function definitions (`def`, `adef` for async)
- Class definitions (`class`)
- Control structures (`if`, `for`, `while`, `try`)
- List/dict comprehensions (`lc`, `dc`)
- React components and hooks
- Express route handlers
- And much more!

### 🔌 Language Server Protocol (LSP)
- Integrates with Nagari's built-in LSP server
- Real-time error checking and diagnostics
- Intelligent code completion
- Symbol navigation and refactoring

### 🐛 Debugging Support
- Debug configuration for Nagari files
- Integration with VS Code's debugging interface
- Source map support for transpiled JavaScript

### ⚙️ Task Integration
- Built-in tasks for common Nagari operations
- Customizable build and run configurations
- Integration with VS Code's task system

## Requirements

- [Nagari compiler](https://github.com/ayanalamMOON/Nagari) installed and available in PATH
- VS Code 1.102.0 or higher

## Installation

### Install Nagari
First, install the Nagari programming language:

```bash
# Clone and build from source
git clone https://github.com/ayanalamMOON/Nagari.git
cd Nagari
cargo build --release

# Add to PATH
export PATH=$PATH:$(pwd)/target/release
```

### Install Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Nagari Language Support"
4. Click Install

## Quick Start

1. Create a new file with `.nag` extension
2. Write your Nagari code:

```nagari
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    print("Fibonacci sequence:")
    for i in range(10):
        result = fibonacci(i)
        print(f"fibonacci({i}) = {result}")

if __name__ == "__main__":
    main()
```

3. Run the file using:
   - Command Palette: `Nagari: Run Nagari File`
   - Right-click menu: `Run Nagari File`
   - Keyboard shortcut: `Ctrl+F5`

## Configuration

Configure the extension through VS Code settings:

```json
{
  "nagari.executable.path": "nag",
  "nagari.lsp.enabled": true,
  "nagari.lsp.port": 0,
  "nagari.transpile.target": "browser",
  "nagari.build.optimize": false,
  "nagari.format.onSave": true
}
```

### Available Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `nagari.executable.path` | Path to Nagari executable | `"nag"` |
| `nagari.lsp.enabled` | Enable Language Server Protocol | `true` |
| `nagari.lsp.port` | LSP server port (0 for stdio) | `0` |
| `nagari.transpile.target` | Transpilation target | `"browser"` |
| `nagari.build.optimize` | Enable build optimization | `false` |
| `nagari.format.onSave` | Format files on save | `true` |

## Commands

| Command | Description | Keybinding |
|---------|-------------|------------|
| `nagari.run` | Run current Nagari file | `Ctrl+F5` |
| `nagari.build` | Build Nagari project | - |
| `nagari.transpile` | Transpile to JavaScript | - |
| `nagari.startRepl` | Start Nagari REPL | - |

## Supported File Types

- `.nag` - Nagari source files

## Language Features

### Python-Inspired Syntax
```nagari
# Comments with # symbol
def greet(name: str = "World") -> str:
    return f"Hello, {name}!"

# List comprehensions
numbers = [x**2 for x in range(10) if x % 2 == 0]

# Pattern matching
match value:
    case {"type": "user", "name": name}:
        print(f"User: {name}")
    case _:
        print("Unknown type")
```

### JavaScript Integration
```nagari
# Import JavaScript modules
import React, { useState } from "react"

# React components
def Counter():
    count, setCount = useState(0)

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    )
```

### Async Programming
```nagari
async def fetch_data(url: str):
    try:
        response = await fetch(url)
        data = await response.json()
        return data
    except Exception as e:
        print(f"Error: {e}")
        return None
```

## Troubleshooting

### Common Issues

**Extension not working?**
- Ensure Nagari is installed and in PATH
- Check VS Code Developer Console for errors
- Verify `.nag` files are recognized by the extension

**LSP not starting?**
- Check `nagari.executable.path` setting
- Ensure Nagari LSP server is working: `nag lsp --help`
- Try disabling and re-enabling LSP in settings

**Commands not found?**
- Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")
- Check if Nagari executable is accessible

### Debugging

Enable extension development logging:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "Developer: Toggle Developer Tools"
3. Check Console for extension messages

## Contributing

We welcome contributions! Please see the [Contributing Guide](https://github.com/ayanalamMOON/Nagari/blob/main/CONTRIBUTING.md) for details.

### Development Setup

1. Clone this repository
2. Open in VS Code
3. Run `npm install`
4. Press `F5` to launch Extension Development Host
5. Test your changes with `.nag` files

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## License

This extension is licensed under the [MIT License](./LICENSE).

## Links

- [Nagari Language Repository](https://github.com/ayanalamMOON/Nagari)
- [Documentation](https://github.com/ayanalamMOON/Nagari/blob/main/docs/)
- [Report Issues](https://github.com/ayanalamMOON/Nagari/issues)
- [Nagari Runtime (npm)](https://www.npmjs.com/package/nagari-runtime)

---

**Enjoy coding with Nagari! 🚀**

*Built with ❤️ for the Nagari programming language community*

## 🎨 Icon Design

The extension features a custom icon with a **King Cobra** wrapped around the letter **"J"**:
- 🐍 **King Cobra**: Represents Nagari's Python-inspired syntax
- 📝 **Letter "J"**: Symbolizes transpilation to JavaScript
- 🎨 **Professional colors**: Blue gradient background with green cobra accents
