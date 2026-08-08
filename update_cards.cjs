const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Total Spend Card
content = content.replace(
  /bg-gradient-to-br from-\[#f5f3ff\] to-white rounded-\[2rem\] p-8 text-slate-900/g,
  'bg-gradient-to-br from-[#a8c0ff] to-[#3f2b96] rounded-[2rem] p-8 text-white border-none'
);
// Fix texts inside Total Spend card
content = content.replace(/text-violet-600 text-\[12px\]/g, 'text-white text-[12px]');
content = content.replace(/text-3xl font-semibold text-violet-500/g, 'text-3xl font-semibold text-white/90');
content = content.replace(/text-\[2\.75rem\] leading-none font-extrabold tracking-tight font-sans text-\[#0f172a\]/g, 'text-[2.75rem] leading-none font-extrabold tracking-tight font-sans text-white');
content = content.replace(/text-slate-500">Pending Approvals/g, 'text-white/80">Pending Approvals');
content = content.replace(/text-violet-600 font-semibold">\{expenses.filter\(e => e.status === 'PENDING'\).length\}/g, 'text-white font-semibold">{expenses.filter(e => e.status === \'PENDING\').length}');
content = content.replace(/text-slate-300">\|/g, 'text-white/40">|');
content = content.replace(/text-slate-500">Refund Requests/g, 'text-white/80">Refund Requests');
content = content.replace(/text-violet-600 font-semibold">\{expenses.filter\(e => e.refund_requested\).length\}/g, 'text-white font-semibold">{expenses.filter(e => e.refund_requested).length}');
content = content.replace(/fill="#f3e8ff"/g, 'fill="#ffffff" fill-opacity="0.1"');

// 2. Financial Overview Card
content = content.replace(
  /bg-white rounded-3xl p-6 shadow-\[0_2px_15px_-3px_rgba\(0,0,0,0\.05\)\] border border-slate-100/g,
  'bg-gradient-to-br from-[#a8c0ff] to-[#3f2b96] rounded-3xl p-6 shadow-md border-none text-white'
);
// Inside Financial overview
content = content.replace(/text-\[11px\] font-bold uppercase tracking-wider text-violet-600 mb-2/g, 'text-[11px] font-bold uppercase tracking-wider text-white/80 mb-2');
content = content.replace(/text-\[1\.1rem\] font-bold text-slate-800/g, 'text-[1.1rem] font-bold text-white');
content = content.replace(/bg-slate-50 border border-slate-100/g, 'bg-white/10 border border-white/20');
content = content.replace(/text-xs text-slate-500 font-medium/g, 'text-xs text-white/90 font-medium');
content = content.replace(/text-violet-600 bg-violet-50/g, 'text-white bg-white/20');
content = content.replace(/text-emerald-600 bg-emerald-50/g, 'text-emerald-300 bg-emerald-400/20');

// 3. Expense Log Cards
content = content.replace(
  /className="p-5 border border-slate-100 dark:border-slate-800 rounded-\[1\.5rem\] bg-white dark:bg-slate-900\/50/g,
  'className="p-5 border border-white/20 rounded-[1.5rem] bg-gradient-to-br from-[#a8c0ff] to-[#3f2b96] text-white'
);
content = content.replace(/text-slate-800 dark:text-white/g, 'text-white');
content = content.replace(/text-slate-400 font-medium/g, 'text-white/70 font-medium');
content = content.replace(/border-slate-200 dark:border-slate-800\/60/g, 'border-white/20');
content = content.replace(/text-slate-500 dark:text-slate-400 font-medium/g, 'text-white/80 font-medium');
content = content.replace(/text-slate-400 shrink-0/g, 'text-white/70 shrink-0');
content = content.replace(/text-slate-700 dark:text-slate-350/g, 'text-white');
content = content.replace(/text-slate-300 dark:text-slate-800/g, 'text-white/40');
content = content.replace(/text-slate-400 dark:text-slate-500 uppercase/g, 'text-white/60 uppercase');
content = content.replace(/text-slate-300 hover:text-red-500/g, 'text-white/50 hover:text-red-300');

// 4. Global glass-panel cards (Dashboard metrics, etc.)
// We append the gradient class to glass-panel, but only if it's a card (usually accompanied by rounded-2xl or rounded-3xl)
// Let's replace 'glass-panel rounded-2xl' with 'glass-panel rounded-2xl bg-gradient-to-br from-[#a8c0ff] to-[#3f2b96] text-white border-none'
content = content.replace(/glass-panel rounded-2xl/g, 'glass-panel rounded-2xl bg-gradient-to-br from-[#a8c0ff] to-[#3f2b96] text-white border-none');
content = content.replace(/glass-panel rounded-3xl/g, 'glass-panel rounded-3xl bg-gradient-to-br from-[#a8c0ff] to-[#3f2b96] text-white border-none');

// For text inside these now-dark cards, we need to lighten standard text classes globally where they appear near glass-panel.
// Actually, it's safer to just do a blanket replace for common text classes in the dashboard section.
// Or we can rely on CSS overriding in index.css for .glass-panel text!
fs.writeFileSync('src/App.tsx', content);
console.log('Cards updated.');
