const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUGGING FILE STRUCTURE');
console.log('='.repeat(50));
console.log('Current directory:', __dirname);
console.log('Parent directory:', path.join(__dirname, '..'));
console.log('\n📁 Files in models directory:');

try {
  const modelsPath = path.join(__dirname, '..', 'models');
  const files = fs.readdirSync(modelsPath);
  console.log(files);
  
  // Check each file's content (first line)
  files.forEach(file => {
    const filePath = path.join(modelsPath, file);
    const content = fs.readFileSync(filePath, 'utf8').split('\n')[0];
    console.log(`- ${file}: ${content.substring(0, 50)}...`);
  });
} catch (error) {
  console.error('❌ Cannot read models directory:', error.message);
}

console.log('\n📁 Files in controllers directory:');
try {
  const controllersPath = path.join(__dirname, '..', 'controllers');
  const files = fs.readdirSync(controllersPath);
  console.log(files);
} catch (error) {
  console.error('❌ Cannot read controllers directory:', error.message);
}

console.log('='.repeat(50));