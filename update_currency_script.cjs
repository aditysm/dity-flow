const fs = require('fs');
let content = fs.readFileSync('app/index.html', 'utf8');

const scriptToAdd = `
    // --- Live Currency Conversion ---
    let exchangeRates = { USD: 0, EUR: 0 };
    async function fetchRates() {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/IDR');
        const data = await res.json();
        exchangeRates.USD = data.rates.USD;
        exchangeRates.EUR = data.rates.EUR;
        updateCurrencyDisplay();
      } catch (err) {
        document.getElementById('currency-values').textContent = "Rate unavailable";
      }
    }
    
    function updateCurrencyDisplay() {
      const amountInput = document.getElementById('amount');
      const val = amountInput.value.replace(/\\./g, '');
      const num = parseFloat(val);
      if (isNaN(num) || num === 0) {
        document.getElementById('currency-values').textContent = \`$0.00 | €0.00\`;
        return;
      }
      
      const usd = (num * exchangeRates.USD).toFixed(2);
      const eur = (num * exchangeRates.EUR).toFixed(2);
      document.getElementById('currency-values').textContent = \`$\${usd} | €\${eur}\`;
    }

    document.getElementById('amount').addEventListener('input', updateCurrencyDisplay);
    fetchRates();
`;

content = content.replace('// --- Initialization ---', scriptToAdd + '\n    // --- Initialization ---');

fs.writeFileSync('app/index.html', content, 'utf8');
console.log('Added currency script');
