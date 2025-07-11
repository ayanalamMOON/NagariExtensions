# Nagari Extension Icons

This directory contains the custom icons for the Nagari VS Code extension.

## Icon Design

The icon features a **King Cobra** (representing Python-inspired syntax) wrapped around the letter **"J"** (representing JavaScript transpilation target).

### Design Elements:
- 🐍 **King Cobra**: Symbolizes Nagari's Python-like syntax
- 📝 **Letter "J"**: Represents transpilation to JavaScript
- 🎨 **Color Scheme**:
  - Background: Blue gradient (professional, tech-focused)
  - Cobra: Green gradient (nature, Python association)
  - Accent: Red eyes and yellow highlights

## Files

- `nagari-icon-light.svg` - 16x16 icon for light themes
- `nagari-icon-dark.svg` - 16x16 icon for dark themes
- `nagari-icon-128.svg` - 128x128 high-resolution version

## Converting to PNG (Required for VS Code)

VS Code requires PNG format for extension icons. To convert the SVG files:

### Option 1: Online Converter
1. Visit [SVG to PNG Converter](https://convertio.co/svg-png/)
2. Upload `nagari-icon-128.svg`
3. Download as `nagari-icon-128.png`
4. Update `package.json` with: `"icon": "images/nagari-icon-128.png"`

### Option 2: Command Line (with ImageMagick)
```bash
# Install ImageMagick
# Windows: choco install imagemagick
# macOS: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Convert to PNG
magick images/nagari-icon-128.svg images/nagari-icon-128.png
```

### Option 3: Node.js Script
```bash
npm install sharp
node -e "
const sharp = require('sharp');
sharp('images/nagari-icon-128.svg')
  .png()
  .toFile('images/nagari-icon-128.png');
"
```

## Icon Preview

The icon design features:
```
┌─────────────────┐
│  🟦🟦🟦🟦🟦🟦🟦🟦  │  ← Blue background
│ 🟦  🐍      🟦 │  ← King Cobra curves around
│🟦   🐍   J   🟦│  ← Letter "J" in center
│ 🟦    🐍    🟦 │  ← Cobra continues curve
│  🟦🟦🟦🟦🟦🟦🟦🟦  │  ← Professional gradient
└─────────────────┘
```

This creates a unique, memorable icon that clearly represents:
1. **Nagari's Python heritage** (King Cobra)
2. **JavaScript transpilation** (Letter J)
3. **Professional development tool** (Blue tech colors)

## Usage in Extension

Once converted to PNG, add to package.json:
```json
{
  "icon": "images/nagari-icon-128.png"
}
```
