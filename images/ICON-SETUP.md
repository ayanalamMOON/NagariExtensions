# Alternative Icon Creation Method

If you prefer a simpler approach or don't want to install additional tools, here are alternative methods:

## Method 1: Online SVG to PNG Converter (Recommended)

1. Go to [SVGtoPNG.com](https://svgtopng.com/) or [Convertio](https://convertio.co/svg-png/)
2. Upload `nagari-icon-128.svg`
3. Download the PNG
4. Save as `nagari-icon-128.png` in the `images` folder
5. Add to `package.json`: `"icon": "images/nagari-icon-128.png"`

## Method 2: Use the Conversion Script

```bash
cd images
npm install sharp
npm run convert
```

This will automatically:
- Convert all SVG icons to PNG
- Update the package.json with the correct icon path

## Method 3: Create Simple Text-Based Icon

For development purposes, you can create a simple 128x128 PNG with text:

1. Open any image editor (Paint, GIMP, Photoshop, etc.)
2. Create a 128x128 pixel image
3. Fill with blue background (#3B82F6)
4. Add white text "🐍J" or "NAG" in center
5. Save as `nagari-icon-128.png`

## Method 4: Use Favicon Generator

1. Go to [Favicon Generator](https://www.favicon-generator.org/)
2. Upload the SVG file
3. Download the 128x128 PNG version
4. Rename to `nagari-icon-128.png`

## Verification

After creating the PNG, verify it works by:

1. Adding to package.json:
   ```json
   {
     "icon": "images/nagari-icon-128.png"
   }
   ```

2. Testing the extension:
   ```bash
   # In the main extension directory
   npm run compile
   # Press F5 to test in Extension Development Host
   ```

The icon should appear in the Extensions panel and when the extension is packaged.
