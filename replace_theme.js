const fs = require('fs');

function processFile(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    
    if (!content.includes("import { themeClasses } from")) {
        // Add import after first import
        content = content.replace(/(import .*?;)/, "$1\nimport { themeClasses, colors } from './theme';");
    }

    // Replace classNames with template literals
    const pattern = /className="([^"]*?)((?:bg-gradient-to-[br]+ )?from-\[#20002c\] to-\[#cbb4d4\]|text-\[#20002c\]|text-\[#cbb4d4\]|bg-\[#20002c\]|bg-\[#cbb4d4\]|border-\[#20002c\])([^"]*?)"/g;
    
    // We need to apply this iteratively because a single className might have multiple matches
    let previousContent = "";
    while (content !== previousContent) {
        previousContent = content;
        content = content.replace(pattern, (match, p1, p2, p3) => {
            let replacement = "";
            if (p2.includes('bg-gradient-to-br')) replacement = "${themeClasses.bgGradientMain}";
            else if (p2.includes('bg-gradient-to-r')) replacement = "${themeClasses.bgGradientRight}";
            else if (p2.includes('bg-gradient-to-b')) replacement = "${themeClasses.bgGradientBottom}";
            else if (p2.includes('from-[')) replacement = "from-[${colors.primaryDark}] to-[${colors.primaryLight}]"; // fallback
            else if (p2 === 'text-[#20002c]') replacement = "${themeClasses.textPrimaryDark}";
            else if (p2 === 'text-[#cbb4d4]') replacement = "${themeClasses.textPrimaryLight}";
            else if (p2 === 'bg-[#20002c]') replacement = "${themeClasses.bgPrimaryDark}";
            else if (p2 === 'bg-[#cbb4d4]') replacement = "${themeClasses.bgPrimaryLight}";
            else if (p2 === 'border-[#20002c]') replacement = "${themeClasses.borderPrimaryDark}";
            else return match; // should not happen
            
            return `className={\`${p1}${replacement}${p3}\`}`;
        });
    }

    // Also handle already template-literaled classNames
    const pattern2 = /className=\{`([^`]*?)((?:bg-gradient-to-[br]+ )?from-\[#20002c\] to-\[#cbb4d4\]|text-\[#20002c\]|text-\[#cbb4d4\]|bg-\[#20002c\]|bg-\[#cbb4d4\]|border-\[#20002c\])([^`]*?)`\}/g;
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
    
    // Inline styles
    content = content.replace(/style=\{\{.*?\}\}/g, (match) => {
        return match.replace(/'#20002c'/g, 'colors.primaryDark').replace(/'#cbb4d4'/g, 'colors.primaryLight');
    });

    fs.writeFileSync(filename, content);
    console.log(`Processed ${filename}`);
}

processFile('src/App.tsx');
processFile('src/components/EntityCreationModal.tsx');
