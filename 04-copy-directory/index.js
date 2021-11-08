const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const pathToDirCopy = path.join(__dirname, 'files-copy');
const pathToDir = path.join(__dirname, 'files');

fs.rm(pathToDirCopy, {force: true, recursive: true}, (err) => {
    if (err) console.error(err.message);

    fsPromises.mkdir(pathToDirCopy, {recursive: true})
    .then( () => fsPromises.readdir(pathToDir, {withFileTypes: true}) )
    .then(data => {
        data.forEach(dirent => {
            if (dirent.isFile()) {
                const pathToFile = path.join(pathToDir, dirent.name);
                const pathToFileCopy = path.join(pathToDirCopy, dirent.name);
                fsPromises.copyFile(pathToFile, pathToFileCopy);
            } else if (dirent.isDirectory()) {
                const pathToFolder = path.join(pathToDir, dirent.name);
                const pathToFolderCopy = path.join(pathToDirCopy, dirent.name);
                fsPromises.mkdir(pathToFolderCopy, {recursive: true});
            }
        })
    })
    .catch(err => console.error(err.message));
})