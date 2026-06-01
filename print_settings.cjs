const fs = require('fs');
const content = fs.readFileSync('src/components/Settings.tsx', 'utf-8');
const lines = content.split('\n');
const start = Math.max(0, 30);
for (let i = start; i < 50; i++) {
  console.log(lines[i]);
}
