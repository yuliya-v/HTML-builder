const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const pathToDir = path.join(__dirname, 'secret-folder');

async function getList() {
    try {
      return await fsPromises.readdir(pathToDir, {withFileTypes: true});
    } catch (err) {
      console.error('Error occured while reading directory!', err);
    }
}
 
getList().then((data => {
    let filesData = data.filter(dirent => dirent.isFile());
    filesData.forEach(dirent => {
        const pathToFile = path.join(pathToDir, dirent.name);
        const fileName = path.parse(pathToFile).name;
        const fileExt = path.parse(pathToFile).ext.slice(1);

        fs.stat(pathToFile, (err, stats) => {
            if (err) console.error(err.message);
            const fileSize = (stats.size / 1024).toFixed(3);
            console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
        });
    })
    }
));
