const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const pathToDist = path.join(__dirname, 'project-dist');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToHtml = path.join(pathToDist, 'index.html');

const pathToStylesDir = path.join(__dirname, 'styles');
const pathToStylesBundle = path.join(pathToDist, 'style.css');
const pathToAssets = path.join(__dirname, 'assets');
const pathToAssetsCopy = path.join(pathToDist, 'assets');

fs.rm(pathToDist, {force: true, recursive: true}, (err) => {
    if (err) console.error(err.message);

    fsPromises.mkdir(pathToDist, {recursive: true})
        .then(() => {
            createFromTemplate(pathToTemplate, pathToComponents, pathToHtml);
            createStylesBundle(pathToStylesDir, pathToStylesBundle);
            copyFolder(pathToAssets, pathToAssetsCopy);
        })
      
})

function copyFolder(inputFolder, outputFolder) {
    fs.rm(outputFolder, {force: true, recursive: true}, (err) => {
        if (err) console.error(err.message);
    
        fsPromises.mkdir(outputFolder, {recursive: true})
        .then( () => fsPromises.readdir(inputFolder, {withFileTypes: true}) )
        .then(data => {
            data.forEach(dirent => {
                if (dirent.isFile()) {
                    const pathToFile = path.join(inputFolder, dirent.name);
                    const pathToFileCopy = path.join(outputFolder, dirent.name);
                    fsPromises.copyFile(pathToFile, pathToFileCopy);
                } else if (dirent.isDirectory()) {
                    const pathToFolder = path.join(inputFolder, dirent.name);
                    const pathToFolderCopy = path.join(outputFolder, dirent.name);
                    copyFolder(pathToFolder, pathToFolderCopy);
                }
            })
        })
        .catch(err => console.error(err.message));
    })
}

function createStylesBundle(inputFolder, outputFile) {
    const output = fs.createWriteStream(outputFile);

    fsPromises.readdir(inputFolder, {withFileTypes: true})
    .then(data => {
        data = data.filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.css');
        for (dirent of data) {
            const cssElemPath = path.join(inputFolder, dirent.name);
            const input = fs.createReadStream(cssElemPath, 'utf-8');
            input.on('data', chunk => output.write(chunk.toString().trim() + '\n'));
            input.on('error', error => console.log(error.message));
        }
    })
}

async function createFromTemplate(templ, components, result) {
    try {
        let htmlTemplate = await fsPromises.readFile(templ, {encoding: 'utf-8'});
        let componentsData = await fsPromises.readdir(components, {withFileTypes: true});
        componentsData.filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.html');
        for await (let dirent of componentsData) {
            const pathToFile = path.join(components, dirent.name);
            const fileName = dirent.name.slice(0, -5);
            templHtml = await fsPromises.readFile(pathToFile, {encoding: 'utf-8'});
            htmlTemplate = htmlTemplate.replace(`{{${fileName}}}`, templHtml);
            await fsPromises.writeFile(result, htmlTemplate);
        }
      } catch (err) {
        console.error('Error occured!', err);
      }   
}