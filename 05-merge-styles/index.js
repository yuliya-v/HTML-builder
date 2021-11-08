const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStylesDir = path.join(__dirname, 'styles');

const output = fs.createWriteStream(pathToBundle);

fsPromises.readdir(pathToStylesDir, {withFileTypes: true} )
    .then(data => {
        data = data.filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.css');
        data.forEach(dirent => {
            const cssElemPath = path.join(pathToStylesDir, dirent.name);
            const input = fs.createReadStream(cssElemPath, 'utf-8');
            input.on('data', chunk => output.write(chunk.toString() + '\n'));
            input.on('error', error => console.log(error.message));
        })
    })
