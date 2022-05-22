const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');


async function f() {

 await fs.promises.rm(path.join(__dirname, 'files-copy'),
 { recursive: true, 
 force: true}, (err) => {if (err) {console.log(err)}});

 await fs.promises.mkdir(path.join(__dirname, 'files-copy'),
  { recursive: true }, 
    (err) => {
        if (err) throw err;
   });


 await fs.readdir(path.join(__dirname, 'files'),
    (err, files) => {
        if (err)
            console.log(err);
            else {
                files.forEach(async file => {
                    await fs.promises.copyFile(path.join(__dirname, 'files',file), path.join(__dirname, 'files-copy', file))
                    })
                }
        console.log("файлы скопированы");
    }
)
} 
f();