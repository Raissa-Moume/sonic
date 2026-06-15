const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { from: /text-white/g, to: 'text-emerald-950' },
  { from: /text-gray-400/g, to: 'text-emerald-800' },
  { from: /text-gray-300/g, to: 'text-emerald-700' },
  { from: /text-gray-500/g, to: 'text-emerald-600' },
  { from: /bg-gray-900/g, to: 'bg-white' },
  { from: /bg-gray-800\/50/g, to: 'bg-pink-50' },
  { from: /bg-gray-800/g, to: 'bg-pink-50' },
  { from: /bg-gray-700/g, to: 'bg-pink-100' },
  { from: /text-purple-400/g, to: 'text-pink-500' },
  { from: /text-purple-500/g, to: 'text-pink-600' },
  { from: /text-cyan-400/g, to: 'text-sky-500' },
  { from: /text-green-400/g, to: 'text-emerald-600' },
  { from: /text-amber-400/g, to: 'text-orange-500' },
  { from: /border-purple-500\/20/g, to: 'border-pink-200' },
  { from: /border-purple-500\/30/g, to: 'border-pink-300' },
  { from: /border-gray-800/g, to: 'border-pink-100' },
  { from: /from-purple-900\/20/g, to: 'from-pink-100' },
  { from: /to-cyan-900\/20/g, to: 'to-sky-100' },
  { from: /bg-purple-500\/10/g, to: 'bg-pink-100' },
  { from: /bg-purple-600/g, to: 'bg-pink-500' },
  { from: /hover:bg-gray-700/g, to: 'hover:bg-pink-100' },
  { from: /hover:bg-gray-800/g, to: 'hover:bg-pink-50' },
  { from: /hover:text-white/g, to: 'hover:text-emerald-950' },
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
console.log('Theme update complete.');
