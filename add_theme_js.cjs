const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const script = `
  <script>
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const html = document.documentElement;
      const darkIcon = document.getElementById('theme-icon-dark');
      const lightIcon = document.getElementById('theme-icon-light');

      // Check saved theme
      if (localStorage.getItem('theme') === 'light') {
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
  </script>
</body>`;

content = content.replace('</body>', script);
fs.writeFileSync('index.html', content, 'utf8');
