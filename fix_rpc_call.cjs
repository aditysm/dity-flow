const fs = require('fs');
let content = fs.readFileSync('app/index.html', 'utf8');

const regex = /p_amount: amount,\s*p_bypass_quota: bypassQuota/;
content = content.replace(regex, 'p_amount: amount');

fs.writeFileSync('app/index.html', content, 'utf8');
console.log('Fixed RPC call');
