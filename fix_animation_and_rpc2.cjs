const fs = require('fs');
let content = fs.readFileSync('app/index.html', 'utf8');

// 1. Add animations to style block
const styleRegex = /<\/style>/;
const newStyles = `
    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .node-animate {
      opacity: 0;
      animation: fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>`;
if (!content.includes('fadeSlideIn')) {
  content = content.replace(styleRegex, newStyles);
}

// 2. Add animation classes and delays to timeline nodes
const initialNodeRegex = /<div class="bg-theme-bg border-2 border-theme-border px-5 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl min-w-\[150px\] sm:min-w-\[250px\] text-center shadow-lg">/g;
content = content.replace(initialNodeRegex, '<div class="bg-theme-bg border-2 border-theme-border px-5 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl min-w-[150px] sm:min-w-[250px] text-center shadow-lg node-animate" style="animation-delay: 0.1s">');

const edgeNodeRegex = /timelineHTML \+= \`\s*<div class="flex flex-col items-center my-1 w-full max-w-md">/g;
const edgeNodeReplacement = `timelineHTML += \`
          <div class="flex flex-col items-center my-1 w-full max-w-md node-animate" style="animation-delay: \${0.1 + (index * 0.15) + 0.05}s">`;
content = content.replace(edgeNodeRegex, edgeNodeReplacement);

const stepNodeRegex = /<div class="bg-theme-bg border-2 \$\{isLast \? 'border-theme-accent text-theme-accent' : 'border-theme-border'\} px-5 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl min-w-\[150px\] sm:min-w-\[250px\] text-center shadow-lg">/g;
const stepNodeReplacement = `<div class="bg-theme-bg border-2 \${isLast ? 'border-theme-accent text-theme-accent' : 'border-theme-border'} px-5 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl min-w-[150px] sm:min-w-[250px] text-center shadow-lg node-animate" style="animation-delay: \${0.1 + (index * 0.15) + 0.15}s">`;
content = content.replace(stepNodeRegex, stepNodeReplacement);

// 3. Fix RPC error
const rpcErrorRegex = /throw new Error\("Gagal memanggil fungsi rute di database\."\);/g;
const rpcErrorReplacement = `const errText = await response.text();
           throw new Error("Gagal memanggil fungsi rute di database: " + errText);`;
content = content.replace(rpcErrorRegex, rpcErrorReplacement);

fs.writeFileSync('app/index.html', content, 'utf8');
console.log('Fixed animation and RPC error logging');
