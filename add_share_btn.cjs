const fs = require('fs');
let content = fs.readFileSync('app/index.html', 'utf8');

// 1. Add Share button next to Export button
const exportBtn = `<button onclick="downloadFlowchart()" class="bg-theme-bg border border-theme-border hover:border-theme-accent text-theme-main px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2" data-html2canvas-ignore>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Ekspor PNG
            </button>`;

const shareBtn = `<button onclick="shareRoute()" class="bg-theme-bg border border-theme-border hover:border-theme-accent text-theme-main px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2" data-html2canvas-ignore>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              Bagikan Rute
            </button>`;

content = content.replace(exportBtn, shareBtn + '\n            ' + exportBtn);

// 2. Add shareRoute function & modify DOMContentLoaded to parse query params
const shareFunc = `
    function shareRoute() {
      const source = document.getElementById('source').value;
      const dest = document.getElementById('destination').value;
      const amountStr = document.getElementById('amount').value.replace(/\\./g, '');
      const amount = parseFloat(amountStr);
      const bypassQuota = document.getElementById('bypass-quota').checked;
      
      if (!source || !dest || isNaN(amount) || amount <= 0) {
        showError("Data rute tidak valid untuk dibagikan.");
        return;
      }
      
      const url = new URL(window.location.href);
      url.searchParams.set('source', source);
      url.searchParams.set('dest', dest);
      url.searchParams.set('amount', amount);
      if (bypassQuota) {
        url.searchParams.set('bypass', 'true');
      } else {
        url.searchParams.delete('bypass');
      }
      
      navigator.clipboard.writeText(url.toString()).then(() => {
        // Optional: show a small toast or change button text temporarily
        alert("Tautan rute disalin ke clipboard!");
      }).catch(err => {
        showError("Gagal menyalin tautan: " + err.message);
      });
    }
`;

content = content.replace('// Initialize fetching institutions', shareFunc + '\n    // Initialize fetching institutions');

const initReplace = `    window.addEventListener('DOMContentLoaded', async () => {
      await loadInstitutions();
      renderRecentSearches();
      
      // Parse query params
      const params = new URLSearchParams(window.location.search);
      const sourceParam = params.get('source');
      const destParam = params.get('dest');
      const amountParam = params.get('amount');
      const bypassParam = params.get('bypass');
      
      if (sourceParam && destParam && amountParam) {
        // Fill form
        const sourceInst = institutionsData.find(i => i.id === sourceParam);
        const destInst = institutionsData.find(i => i.id === destParam);
        
        if (sourceInst && destInst) {
          selectOption('source', sourceParam, sourceInst.name);
          selectOption('destination', destParam, destInst.name);
          
          const amountInput = document.getElementById('amount');
          amountInput.value = new Intl.NumberFormat('id-ID').format(amountParam);
          
          if (bypassParam === 'true') {
            document.getElementById('bypass-quota').checked = true;
          }
          
          // Auto submit
          setTimeout(() => {
            document.getElementById('route-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }, 100);
        }
      }
    });`;

content = content.replace(/window\.addEventListener\('DOMContentLoaded', \(\) => \{\s*loadInstitutions\(\);\s*renderRecentSearches\(\);\s*\}\);/, initReplace);

fs.writeFileSync('app/index.html', content, 'utf8');
