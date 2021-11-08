const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile);

process.on('SIGINT', () => {
    stdout.write('\nТекст сохранён в файле "text.txt". До свидания!\n');
    process.exit();
});

stdout.write('Добрый день! Введите ваш текст:\n');

stdin.on('data', (data) => {
    const dataStringified = data.toString().trim();
    if (dataStringified === 'exit') {
        stdout.write('\nТекст сохранён в файле "text.txt". До свидания!\n');
        process.exit();
    }    
    output.write(data);
})


