const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');


fs.readdir(path.join(__dirname,'secret-folder'), 
    { withFileTypes: true },
    (err, files) => {
    console.log("\nCurrent directory files:");
    if (err)
      console.log(err);
    else {
      const filesFilter = files.filter(item => item = item.isFile());
      filesFilter.forEach(file => {
        const notes = file.name;
        fs.stat(path.join(__dirname,'secret-folder',notes), (err, stats) => {
            if (err) {
              console.error(err)
              return
            }
            const nameFile = path.basename(notes, path.extname(notes));
            const extnameFile = path.extname(notes).slice(1);
            console.log(nameFile,'-', extnameFile,'-', stats.size/1024,'kb');
          }) 
      })
    }
  })
