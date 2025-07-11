# Contributing to Nagari Language Support

Thank you for your interest in contributing to the Nagari Language Support extension! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Visual Studio Code** (latest version)
- **Git**
- **TypeScript** knowledge (helpful but not required)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/NagariExtensions.git
   cd NagariExtensions
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Open in VS Code**
   ```bash
   code .
   ```

4. **Run the Extension**
   - Press `F5` to launch a new VS Code window with the extension loaded
   - Open a `.nag` file to test the extension features

## 📁 Project Structure

```
NagariExtensions/
├── src/
│   └── extension.ts          # Main extension logic
├── syntaxes/
│   └── nagari.tmLanguage.json # TextMate grammar
├── snippets/
│   └── nagari.json           # Code snippets
├── themes/
│   ├── nagari-dark-theme.json    # Dark color theme
│   ├── nagari-light-theme.json   # Light color theme
│   └── nagari-file-icons.json    # File icon theme
├── images/                   # Extension icons
├── examples/                 # Example Nagari files
├── language-configuration.json # Language config
├── package.json             # Extension manifest
└── README.md
```

## 🛠️ Development Guide

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Edit the relevant files
   - Test your changes using `F5`

3. **Compile TypeScript**
   ```bash
   npm run compile
   ```

4. **Test Thoroughly**
   - Test all existing functionality
   - Test your new features
   - Check for TypeScript errors

### Key Areas for Contribution

#### 🎨 Syntax Highlighting
- **File**: `syntaxes/nagari.tmLanguage.json`
- **Purpose**: Defines how Nagari code is highlighted
- **Format**: TextMate grammar JSON
- **Testing**: Create `.nag` files with various syntax patterns

#### 📝 Code Snippets
- **File**: `snippets/nagari.json`
- **Purpose**: Provides code completion snippets
- **Format**: VS Code snippet JSON
- **Guidelines**:
  - Use clear, descriptive names
  - Include useful placeholders
  - Add helpful descriptions

#### 🚀 Extension Logic
- **File**: `src/extension.ts`
- **Purpose**: Main extension functionality
- **Language**: TypeScript
- **Features**: Commands, LSP client, task provider

#### 🎨 Themes
- **Files**: `themes/*.json`
- **Purpose**: Color themes and file icons
- **Guidelines**: Follow VS Code theme standards

## 📝 Contribution Types

### 🐛 Bug Fixes
1. **Identify the Issue**
   - Check existing issues
   - Reproduce the bug
   - Document steps to reproduce

2. **Fix the Bug**
   - Create a focused fix
   - Add comments explaining the solution
   - Test the fix thoroughly

3. **Submit Pull Request**
   - Clear description of the problem and solution
   - Link to the related issue

### ✨ New Features
1. **Discuss First**
   - Open an issue to discuss the feature
   - Get feedback from maintainers
   - Ensure it fits the project goals

2. **Implement**
   - Follow existing code patterns
   - Add comprehensive tests
   - Update documentation

3. **Document**
   - Update README if needed
   - Add changelog entries
   - Include usage examples

### 📚 Documentation
- **README.md**: User-facing documentation
- **CHANGELOG.md**: Track changes
- **Code comments**: Explain complex logic
- **Examples**: Demonstrate features

## 🧪 Testing

### Manual Testing
1. **Extension Activation**
   - Open a workspace with `.nag` files
   - Verify extension activates properly

2. **Syntax Highlighting**
   - Test various Nagari constructs
   - Check edge cases and complex syntax

3. **Commands**
   - Test all extension commands
   - Verify error handling

4. **LSP Features**
   - Test auto-completion
   - Check error diagnostics
   - Verify hover information

### Automated Testing
```bash
# Run tests (when available)
npm test

# Lint code
npm run lint

# Check TypeScript compilation
npm run compile
```

## 📊 Code Quality

### TypeScript Guidelines
- Use strict type checking
- Add type annotations for public APIs
- Prefer interfaces over types for objects
- Use meaningful variable names

### Code Style
- Use 4-space indentation
- Maximum line length: 120 characters
- Use semicolons
- Prefer `const` over `let` when possible

### Naming Conventions
- Functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.ts`

## 🔄 Pull Request Process

### Before Submitting
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Self-review completed

### PR Guidelines
1. **Title**: Clear, descriptive title
2. **Description**:
   - What changes were made
   - Why they were made
   - How to test them
3. **Size**: Keep PRs focused and reasonably sized
4. **Testing**: Include testing instructions

### Review Process
1. **Automated Checks**: CI/CD pipeline runs
2. **Code Review**: Maintainer reviews the code
3. **Testing**: Changes are tested
4. **Merge**: PR is merged after approval

## 🐛 Issue Reporting

### Bug Reports
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows, macOS, Linux]
- VS Code Version: [e.g. 1.74.0]
- Extension Version: [e.g. 0.1.0]
```

### Feature Requests
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 📦 Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

### Release Steps
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release commit
4. Tag the release
5. Publish to marketplace

## 🤝 Community

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers
- Follow GitHub's community guidelines

### Getting Help
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs and request features
- **Discord**: Join the Nagari community (link TBD)

## 🏆 Recognition

Contributors will be:
- Listed in the CONTRIBUTORS.md file
- Mentioned in release notes
- Given credit in the extension description

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

---

Thank you for contributing to Nagari Language Support! 🎉

Your contributions help make Nagari development better for everyone. Whether you're fixing bugs, adding features, improving documentation, or helping other users, every contribution is valuable and appreciated.

**Happy coding! 🚀**
