const fileStream = require('fs');
const path = require('path');
const way = path.resolve('01-read-file', 'text.txt');

let readStream = fileStream.createReadStream(way, 'utf8');
let data = '';


readStream.on('data', chunk => data += chunk);
readStream.on('end', () => console.log(data));