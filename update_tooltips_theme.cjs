const fs = require('fs');

function addThemeToggle(content) {
  const navRegex = /<div class="flex items-center gap-6">/;
  const themeBtn = `<div class="flex items-center gap-6">
        <button id="theme-toggle" class="text-theme-textDim hover:text-theme-main transition-colors focus:outline-none" aria-label="Toggle theme">
          <svg id="theme-icon-dark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          <svg id="theme-icon-light" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </button>`;
  
  if (!content.includes('id="theme-toggle"')) {
    content = content.replace(navRegex, themeBtn);
  }

  const scriptToAdd = `
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const html = document.documentElement;
      const darkIcon = document.getElementById('theme-icon-dark');
      const lightIcon = document.getElementById('theme-icon-light');

      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light') {
        html.classList.remove('dark');
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
      }

      themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
          localStorage.setItem('theme', 'dark');
          darkIcon.classList.remove('hidden');
          lightIcon.classList.add('hidden');
        } else {
          localStorage.setItem('theme', 'light');
          darkIcon.classList.add('hidden');
          lightIcon.classList.remove('hidden');
        }
      });
    }
  </script>`;
  
  if (!content.includes('themeToggle.addEventListener')) {
    content = content.replace('</script>\n</body>', scriptToAdd + '\n</body>');
  }

  return content;
}

function processAppHtml(path) {
  let content = fs.readFileSync(path, 'utf8');

  content = addThemeToggle(content);

  // Replace Nominal Transaksi label
  const nominalRegex = /<label class="text-\[0\.625rem\] sm:text-\[0\.6875rem\] uppercase tracking-\[0\.1em\] text-theme-textDim mb-2 block font-medium">Nominal Transaksi<\/label>/;
  const newNominal = `<label class="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.1em] text-theme-textDim mb-2 flex items-center gap-1.5 font-medium relative group cursor-help w-max">
            Nominal Transaksi
            <svg class="w-3.5 h-3.5 text-theme-textDim group-hover:text-theme-main transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div class="absolute bottom-full left-0 mb-2 w-48 p-2 bg-theme-border text-theme-main text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none before:content-[''] before:absolute before:top-full before:left-4 before:border-4 before:border-transparent before:border-t-theme-border normal-case tracking-normal">
              Masukkan jumlah uang untuk kalkulasi biaya yang akurat.
            </div>
          </label>`;
  content = content.replace(nominalRegex, newNominal);

  // Replace Bypass Quota label
  const bypassRegex = /<label for="bypass-quota" class="text-xs sm:text-\[0\.8125rem\] text-theme-textDim cursor-pointer select-none leading-tight hover:text-theme-main transition-colors pt-0\.5">([\s\S]*?)<\/label>/;
  const newBypass = `<label for="bypass-quota" class="text-xs sm:text-[0.8125rem] text-theme-textDim cursor-pointer select-none leading-tight hover:text-theme-main transition-colors pt-0.5 relative group cursor-help w-max">
            $1
            <svg class="w-3.5 h-3.5 inline-block ml-1 text-theme-textDim group-hover:text-theme-main transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div class="absolute bottom-full left-0 mb-2 w-56 p-2 bg-theme-border text-theme-main text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none before:content-[''] before:absolute before:top-full before:left-4 before:border-4 before:border-transparent before:border-t-theme-border font-normal normal-case tracking-normal">
              Centang jika kuota gratis di bank sumber habis, agar sistem mencari alternatif terhemat.
            </div>
          </label>`;
  content = content.replace(bypassRegex, newBypass);

  fs.writeFileSync(path, content, 'utf8');
}

function processIndexHtml(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = addThemeToggle(content);
  fs.writeFileSync(path, content, 'utf8');
}

processAppHtml('app/index.html');
processIndexHtml('index.html');
console.log('Update tooltips and theme toggle complete');
