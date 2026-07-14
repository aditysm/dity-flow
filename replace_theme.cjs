const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Replace Tailwind config
  const oldConfigRegex = /tailwind\.config\s*=\s*\{[\s\S]*?\}(?=\s*<\/script>)/;
  const newConfig = `tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            theme: {
              bg: 'var(--color-bg)',
              card: 'var(--color-card)',
              accent: 'var(--color-accent)',
              textDim: 'var(--color-text-dim)',
              border: 'var(--color-border)',
              main: 'var(--color-text-main)',
              inverted: 'var(--color-text-inv)',
              badge: 'var(--color-badge)',
            }
          },
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            mono: ['monospace'],
          },
        }
      }
    }`;
  content = content.replace(oldConfigRegex, newConfig);

  // Replace styles
  const styleRegex = /<style>([\s\S]*?)<\/style>/;
  const newStyle = `<style>
    :root {
      --color-bg: #f8fafc;
      --color-card: #ffffff;
      --color-accent: #00ba68;
      --color-text-dim: #64748b;
      --color-border: #e2e8f0;
      --color-text-main: #0f172a;
      --color-text-inv: #ffffff;
      --color-badge: #f1f5f9;
    }
    .dark {
      --color-bg: #050505;
      --color-card: #121214;
      --color-accent: #00FF94;
      --color-text-dim: #8E8E93;
      --color-border: #242426;
      --color-text-main: #ffffff;
      --color-text-inv: #000000;
      --color-badge: #242426;
    }
    $1
  </style>`;
  content = content.replace(styleRegex, newStyle);

  // Add html class
  if (!content.includes('class="dark"')) {
    content = content.replace(/<html([^>]*)>/, '<html$1 class="dark">');
  }

  // Replace class names globally
  content = content.replace(/\btext-white\b/g, 'text-theme-main');
  content = content.replace(/\btext-black\b/g, 'text-theme-inverted');
  content = content.replace(/\bbg-\[\#242426\]\b/g, 'bg-theme-badge');
  content = content.replace(/\bfrom-\[\#0D0D0F\]\b/g, 'from-theme-card');
  content = content.replace(/\bto-\[\#050505\]\b/g, 'to-theme-bg');

  fs.writeFileSync(path, content, 'utf8');
}

processFile('index.html');
processFile('app/index.html');
console.log('Theme processing complete');
