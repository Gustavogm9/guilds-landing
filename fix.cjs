const fs = require('fs');
const file = 'src/components/raiox/QuizEngine.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.split('\\`').join('`');
fs.writeFileSync(file, content);
console.log('Fixed');
