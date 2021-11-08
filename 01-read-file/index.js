const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(pathToFile, 'utf-8');

let output = '';
stream.on('data', chunk => output += chunk);
stream.on('end', () => console.log('\n', output));
stream.on('error', (er) => console.log(er.message));
