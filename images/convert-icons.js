const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
    const svgFiles = [
        { input: 'nagari-icon-128.svg', output: 'nagari-icon-128.png', size: 128 },
        { input: 'nagari-icon-light.svg', output: 'nagari-icon-16-light.png', size: 16 },
        { input: 'nagari-icon-dark.svg', output: 'nagari-icon-16-dark.png', size: 16 }
    ];

    for (const file of svgFiles) {
        try {
            await sharp(file.input)
                .resize(file.size, file.size)
                .png()
                .toFile(file.output);

            console.log(`✅ Converted ${file.input} to ${file.output}`);
        } catch (error) {
            console.error(`❌ Error converting ${file.input}:`, error.message);
        }
    }

    // Update package.json to include the icon
    const packageJsonPath = '../package.json';
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            packageJson.icon = 'images/nagari-icon-128.png';

            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log('✅ Updated package.json with icon path');
        } catch (error) {
            console.error('❌ Error updating package.json:', error.message);
        }
    }
}

// Check if sharp is installed
try {
    require('sharp');
    convertSvgToPng();
} catch (error) {
    console.log('📦 Sharp not found. Installing...');
    console.log('Run: npm install sharp');
    console.log('Then run: npm run convert');
}
