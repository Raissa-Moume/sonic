const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Text colors
  { from: /text-emerald-950/g, to: 'text-gray-900' },
  { from: /text-emerald-800/g, to: 'text-gray-600' },
  { from: /text-emerald-700/g, to: 'text-gray-500' },
  { from: /text-emerald-600/g, to: 'text-green-600' },
  { from: /text-pink-500/g, to: 'text-green-600' },
  { from: /text-pink-600/g, to: 'text-green-700' },
  { from: /text-sky-500/g, to: 'text-blue-500' },
  
  // Backgrounds
  { from: /bg-pink-50/g, to: 'bg-white' },
  { from: /bg-pink-100/g, to: 'bg-green-50' },
  { from: /bg-pink-500/g, to: 'bg-green-500' },
  
  // Borders
  { from: /border-pink-200/g, to: 'border-gray-200' },
  { from: /border-pink-300/g, to: 'border-gray-300' },
  { from: /border-pink-100/g, to: 'border-gray-100' },
  
  // Gradients (remove pink/sky, use green/teal)
  { from: /from-pink-100/g, to: 'from-green-50' },
  { from: /to-sky-100/g, to: 'to-teal-50' },
  
  // Hovers
  { from: /hover:bg-pink-100/g, to: 'hover:bg-gray-100' },
  { from: /hover:bg-pink-50/g, to: 'hover:bg-gray-50' },
  { from: /hover:text-emerald-950/g, to: 'hover:text-gray-900' },
  
  // Custom WhatsApp specific replaces for glass/cards
  { from: /glass/g, to: 'bg-white shadow-sm border border-gray-100' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      replacements.forEach(r => {
        content = content.replace(r.from, r.to);
      });
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('WhatsApp Theme update complete.');
