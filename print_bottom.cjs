const fs = require('fs');
const content = fs.readFileSync('src/components/ContentLibrary.tsx', 'utf-8');
const lines = content.split('\n');
let insideCard = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('className="library-card"')) {
      for(let j=i; j<lines.length && j < i+35; j++) {
          console.log(lines[j]);
      }
      break;
  }
}
