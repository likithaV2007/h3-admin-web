const fs = require('fs');

function processFile(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    
    if (!content.includes("import { themeClasses, colors } from")) {
        content = content.replace(/(import .*?;)/, "$1\nimport { themeClasses, colors } from './theme';");
    }

    // Replace basic inline styles
    content = content.replace(/style="background-color: #20002c;/g, 'style={{ backgroundColor: colors.primaryDark, ');
    content = content.replace(/style="width: 10px; h-10px; background-color: #20002c;/g, 'style={{ width: "10px", height: "10px", backgroundColor: colors.primaryDark, ');
    // Note: The original code had `style="..."` which is invalid in React. `App.tsx` lines 869 and 872 had `style="..."`.
    // Let's fix them to valid React style objects since we are touching them.
    content = content.replace(/style="background-color: #20002c; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: bold; white-space: nowrap; border: 1.5px solid white; box-shadow: 0 2px 6px rgba\(0,0,0,0.4\);"/g, 
        "style={{ backgroundColor: colors.primaryDark, color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap', border: '1.5px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}");
    content = content.replace(/style="width: 10px; h-10px; background-color: #20002c; transform: rotate\(45deg\); margin: -4px auto 0 auto; border-right: 1.5px solid white; border-bottom: 1.5px solid white;"/g,
        "style={{ width: '10px', height: '10px', backgroundColor: colors.primaryDark, transform: 'rotate(45deg)', margin: '-4px auto 0 auto', borderRight: '1.5px solid white', borderBottom: '1.5px solid white' }}");

    // Replace classNames with template literals (single-line matches)
    const pattern = /className="([^"]*?)((?:bg-gradient-to-[br]+ )?from-\[#20002c\] to-\[#cbb4d4\]|text-\[#20002c\]|text-\[#cbb4d4\]|bg-\[#20002c\]|bg-\[#cbb4d4\]|border-\[#20002c\])([^"]*?)"/g;
    
    let previousContent = "";
    while (content !== previousContent) {
        previousContent = content;
        content = content.replace(pattern, (match, p1, p2, p3) => {
            let replacement = "";
            if (p2.includes('bg-gradient-to-br')) replacement = "${themeClasses.bgGradientMain}";
            else if (p2.includes('bg-gradient-to-r')) replacement = "${themeClasses.bgGradientRight}";
            else if (p2.includes('bg-gradient-to-b')) replacement = "${themeClasses.bgGradientBottom}";
            else if (p2 === 'text-[#20002c]') replacement = "${themeClasses.textPrimaryDark}";
            else if (p2 === 'text-[#cbb4d4]') replacement = "${themeClasses.textPrimaryLight}";
            else if (p2 === 'bg-[#20002c]') replacement = "${themeClasses.bgPrimaryDark}";
            else if (p2 === 'bg-[#cbb4d4]') replacement = "${themeClasses.bgPrimaryLight}";
            else if (p2 === 'border-[#20002c]') replacement = "${themeClasses.borderPrimaryDark}";
            else return match; 
            
            return `className={\`${p1}${replacement}${p3}\`}`;
        });
    }

    // Also handle already template-literaled classNames (multi-line supported by [\s\S])
    const pattern2 = /className=\{`([\s\S]*?)((?:bg-gradient-to-[br]+ )?from-\[#20002c\] to-\[#cbb4d4\]|text-\[#20002c\]|text-\[#cbb4d4\]|bg-\[#20002c\]|bg-\[#cbb4d4\]|border-\[#20002c\])([\s\S]*?)`\}/g;
    previousContent = "";
    while (content !== previousContent) {
        previousContent = content;
        content = content.replace(pattern2, (match, p1, p2, p3) => {
            let replacement = "";
            if (p2.includes('bg-gradient-to-br')) replacement = "${themeClasses.bgGradientMain}";
            else if (p2.includes('bg-gradient-to-r')) replacement = "${themeClasses.bgGradientRight}";
            else if (p2.includes('bg-gradient-to-b')) replacement = "${themeClasses.bgGradientBottom}";
            else if (p2 === 'text-[#20002c]') replacement = "${themeClasses.textPrimaryDark}";
            else if (p2 === 'text-[#cbb4d4]') replacement = "${themeClasses.textPrimaryLight}";
            else if (p2 === 'bg-[#20002c]') replacement = "${themeClasses.bgPrimaryDark}";
            else if (p2 === 'bg-[#cbb4d4]') replacement = "${themeClasses.bgPrimaryLight}";
            else if (p2 === 'border-[#20002c]') replacement = "${themeClasses.borderPrimaryDark}";
            else return match; 
            
            return `className={\`${p1}${replacement}${p3}\`}`;
        });
    }

    fs.writeFileSync(filename, content);
    console.log(`Processed ${filename}`);
}

processFile('src/App.tsx');
processFile('src/components/EntityCreationModal.tsx');
