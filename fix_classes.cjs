const fs = require('fs');
let content = fs.readFileSync('app/index.html', 'utf8');

// Fix body
content = content.replace('text-theme-textDim min-h-screen', 'text-theme-main min-h-screen');

// Fix dropdown buttons
content = content.replace(/pl-4 pr-10 py-3\.5 text-base sm:text-\[0\.9375rem\] text-theme-textDim/g, 'pl-4 pr-10 py-3.5 text-base sm:text-[0.9375rem] text-theme-main');

// Fix select-value
content = content.replace(/select-value text-theme-textDim/g, 'select-value text-theme-main');

// Fix dropdown icon
content = content.replace(/h-4 w-4 text-theme-textDim transition-transform dropdown-icon/g, 'h-4 w-4 text-theme-main transition-transform dropdown-icon');

// Fix amount input
content = content.replace(/text-base sm:text-\[0\.9375rem\] text-theme-textDim/g, 'text-base sm:text-[0.9375rem] text-theme-main');
content = content.replace(/text-theme-textDim opacity-40/g, 'text-theme-main opacity-40');

// Fix empty state
content = content.replace(/mb-4 text-theme-textDim">\s*<svg class="w-8 h-8"/g, 'mb-4 text-theme-main">\n          <svg class="w-8 h-8"');
content = content.replace(/text-lg font-medium text-theme-textDim">Belum ada rute/g, 'text-lg font-medium text-theme-main">Belum ada rute');

// Fix Javascript classlist references
content = content.replace(/display\.classList\.remove\('text-theme-textDim'\);/g, "display.classList.remove('text-theme-main');");
content = content.replace(/display\.classList\.add\('text-theme-textDim'\);/g, "display.classList.add('text-theme-main');");
content = content.replace(/el\.classList\.remove\('text-theme-textDim', 'hover:bg-theme-border'\);/g, "el.classList.remove('text-theme-main', 'hover:bg-theme-border');");
content = content.replace(/el\.classList\.add\('text-theme-textDim', 'hover:bg-theme-border'\);/g, "el.classList.add('text-theme-main', 'hover:bg-theme-border');");

// Fix dropdown options in js
content = content.replace(/text-theme-textDim hover:bg-theme-border/g, 'text-theme-main hover:bg-theme-border');

// Fix Total Summary text
content = content.replace(/text-theme-textDim font-bold text-xs px-4/g, 'text-theme-main font-bold text-xs px-4');

// Fix Share and Export buttons
content = content.replace(/hover:border-theme-accent text-theme-textDim px-4/g, 'hover:border-theme-accent text-theme-main px-4');

// Fix 'VS' badge
content = content.replace(/px-2 text-theme-textDim text-xs absolute/g, 'px-2 text-theme-main text-xs absolute');

// Fix routing steps notes
content = content.replace(/text-theme-textDim text-\[0\.84375rem\]/g, 'text-theme-main text-[0.84375rem]');

// Fix Ringkasan Biaya title
content = content.replace(/text-base font-bold text-theme-textDim/g, 'text-base font-bold text-theme-main');

// Fix Biaya Admin
content = content.replace(/font-bold \$\{totalFee === 0 \? 'text-theme-accent' : \(savedAmount < 0 \? 'text-rose-500' : 'text-theme-textDim'\)\}/g, "font-bold ${totalFee === 0 ? 'text-theme-accent' : (savedAmount < 0 ? 'text-rose-500' : 'text-theme-main')}");

// Fix Uang Diselamatkan
content = content.replace(/font-bold \$\{savedAmount > 0 \? 'text-theme-textDim' : 'text-theme-textDim'\}/g, "font-bold ${savedAmount > 0 ? 'text-theme-main' : 'text-theme-main'}");
content = content.replace(/text-xs \$\{savedAmount < 0 \? 'text-rose-400' : 'text-theme-textDim'\} mt-2/g, "text-xs ${savedAmount < 0 ? 'text-rose-400' : 'text-theme-main'} mt-2");
content = content.replace(/text-xl sm:text-\[1\.75rem\] font-bold \$\{totalFee === 0 \? 'text-theme-accent' : \(savedAmount < 0 \? 'text-rose-500' : 'text-theme-textDim'\)\}/g, "text-xl sm:text-[1.75rem] font-bold ${totalFee === 0 ? 'text-theme-accent' : (savedAmount < 0 ? 'text-rose-500' : 'text-theme-main')}");
content = content.replace(/text-xs text-theme-textDim mt-2">Biaya transfer antarbank/g, 'text-xs text-theme-main mt-2">Biaya transfer antarbank');

// Fix Recent search items
content = content.replace(/font-semibold text-theme-textDim group-hover/g, 'font-semibold text-theme-main group-hover');
content = content.replace(/<span class="text-theme-textDim mx-1">/g, '<span class="text-theme-main mx-1">');
content = content.replace(/text-\[0\.625rem\] sm:text-\[0\.6875rem\] text-theme-textDim mt-0\.5/g, 'text-[0.625rem] sm:text-[0.6875rem] text-theme-main mt-0.5');
content = content.replace(/text-theme-textDim group-hover:text-theme-accent transition-colors opacity-0/g, 'text-theme-main group-hover:text-theme-accent transition-colors opacity-0');

fs.writeFileSync('app/index.html', content, 'utf8');
