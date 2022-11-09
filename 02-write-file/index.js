const fs = require('fs');
const process = require('process');
const { stdin } = process;
const path = require('path');

let ws = fs.createWriteStream(path.join(__dirname, 'data.txt'));
console.log('Please type in the text');

stdin.on('data', (buffer) => {
  if (buffer.toString().trim() == 'exit') {
    console.log('Command = "exit". Goodbye!');
    process.exit();     
  }
  console.log('Please type in the text');
  ws.write(buffer);  
});

process.on('SIGINT', () => {
  console.log('Command = "Cntl+C". Goodbye!');
  process.exit(); 
});

process.stdin.resume();



