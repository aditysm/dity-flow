const fs = require('fs');
let content = fs.readFileSync('app/index.html', 'utf8');

const regex = /<div id="currency-display"[\s\S]*?<\/div>/;
content = content.replace(regex, '');

content = content.replace(/<div class="relative flex flex-col([^>]*)>\s*<div class="flex items-center">([\s\S]*?)<\/div>\s*<\/div>/, '<div class="relative flex items-center bg-theme-card border border-theme-border rounded-xl focus-within:border-theme-accent transition-colors">$2</div>');

fs.writeFileSync('app/index.html', content, 'utf8');
