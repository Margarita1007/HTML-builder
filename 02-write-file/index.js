const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname,'text.txt'));
stdout.write('Введите текст\n')  
stdin.on('data', chunk => {
    if (chunk.toString().trim() === 'exit') {
        stdout.write('До свидания!');
        process.exit();
    } else {
            output.write(chunk)}});

process.on('SIGINT', () => {
    stdout.write('Удачи');
    process.exit()});
