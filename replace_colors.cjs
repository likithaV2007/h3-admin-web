const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace active button blue backgrounds with purple gradient
content = content.replace(/bg-blue-600 text-slate-900/g, 'bg-gradient-to-r from-violet-500 to-purple-500 text-white');

// General blue replacements to violet
content = content.replace(/bg-blue-600/g, 'bg-violet-600');
content = content.replace(/text-blue-600/g, 'text-violet-600');
content = content.replace(/border-blue-600/g, 'border-violet-600');
content = content.replace(/shadow-blue-500\/20/g, 'shadow-violet-500/25');
content = content.replace(/shadow-blue-950\/20/g, 'shadow-violet-950/20');

// General teal replacements to violet (for filters, etc.)
content = content.replace(/bg-teal-600 text-slate-900 shadow-md shadow-teal-500\/20/g, 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/20');
content = content.replace(/bg-teal-600/g, 'bg-violet-600');
content = content.replace(/text-teal-600/g, 'text-violet-600');
content = content.replace(/bg-teal-500\/15 text-teal-700/g, 'bg-violet-500/15 text-violet-700');
content = content.replace(/border-teal-500\/30/g, 'border-violet-500/30');

// General cyan replacements to emerald (for amounts)
content = content.replace(/text-cyan-600/g, 'text-emerald-600');
content = content.replace(/bg-cyan-500/g, 'bg-emerald-500');
content = content.replace(/border-cyan-500/g, 'border-emerald-500');

fs.writeFileSync('src/App.tsx', content);
console.log('Colors replaced in App.tsx');
