const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'),
  { recursive: true }, () => {
    console.log('папка создана');
  });
  

fs.readdir(path.join(__dirname, 'files'),
    (err, files) => {
        if (err)
            console.log(err);
            else {
                files.forEach(file => {
                    fs.copyFile(path.join(__dirname, 'files',file), path.join(__dirname, 'files-copy', file),(err) => {
                        if (err) throw err;})
                    })
                }
        console.log("файлы скопированы");
    }
)

         