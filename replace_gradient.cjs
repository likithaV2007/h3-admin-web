const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard gradient
content = content.replace(/from-violet-500 to-purple-500/g, 'from-[#a8c0ff] to-[#3f2b96]');

// Replace hover gradient (if any)
content = content.replace(/hover:from-violet-600 hover:to-purple-600/g, 'hover:brightness-110');

fs.writeFileSync('src/App.tsx', content);
console.log('Gradient replaced in App.tsx');
