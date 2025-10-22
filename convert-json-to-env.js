const fs = require('fs');

const json = fs.readFileSync('./testttt.json', 'utf8');
const escaped = JSON.stringify(JSON.parse(json));

console.log('Copy this for your .env or Vercel env var:\n');
console.log(`GOOGLE_SERVICE_ACCOUNT_KEY_JSON='${escaped}'`);
