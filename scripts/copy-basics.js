const fs = require('fs');
const path = require('path');

// Ensure directory exists
const targetDir = path.join(__dirname, '../dist/kingdom-come-deliverance-2-potions');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Source and target paths
const sourcePath = path.join(__dirname, '../public/kingdom-come-deliverance-2-potions/alchemy-basics.html');
const targetPath = path.join(targetDir, 'alchemy-basics.html');

// Copy the file
try {
  const content = fs.readFileSync(sourcePath, 'utf8');
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`Successfully copied: ${targetPath}`);
} catch (error) {
  console.error(`Error copying file: ${error.message}`);
} 