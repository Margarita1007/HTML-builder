const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname,'project-dist','bundle.css'));

fs.readdir(path.join(__dirname, 'styles'),
{ withFileTypes: true },
    (err, files) => {
        if (err)
            console.log(err);
            else {
                const filesFilter = files.filter(item => path.extname(item.name) === '.css');
                filesFilter.forEach(file => {
                    const readStyle = fs.createReadStream(path.join(__dirname,'styles', file.name),'utf-8');
                    readStyle.on('data', data => {
                        output.write(data+'\n')
                 });
                   
            })
    }}
)