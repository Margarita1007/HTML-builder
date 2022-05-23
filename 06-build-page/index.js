const fs = require('fs');
const path = require('path');
util = require("util");



fs.mkdir(path.join(__dirname, 'project-dist'),  // создание assets в project-dist
            { recursive: true }, () => {
                console.log('папка project-dist создана');
            });

fs.readdir(path.join(__dirname, 'assets'),           //читаем папку assets
    (err, files) => {
         if (err) 
            {console.log(err)}
        else {  
            fs.rm(path.join(__dirname, 'project-dist', 'assets'), //очищение assets
                { recursive: true, 
                force: false}, (err) => {
                    if (err) { fs.mkdir(path.join(__dirname, 'project-dist', 'assets'),  
                    { recursive: true },(err) => {
                      if (err) throw err;
                    });}
                    
            fs.mkdir(path.join(__dirname, 'project-dist', 'assets'),  // создание assets в project-dist
                { recursive: true }, () => {
                    console.log('папка assets создана');
                });
            files.forEach(file => {
                fs.stat(path.join(__dirname,'assets', file), (err, stats) => {
                if (stats.isFile()) {
                        fs.copyFile(path.join(__dirname, 'assets',file), path.join(__dirname, 'project-dist', 'assets', file),(err) => {
                            if (err) throw err;})
                    }
                if (stats.isDirectory()) {
                    const nameDir = path.basename(file, path.extname(file));
                   fs.mkdir(path.join(__dirname, 'project-dist', 'assets', nameDir),
                   { recursive: true }, () => {
                 return
                   });
                    fs.readdir(path.join(__dirname, 'assets', nameDir),
                        (err, files) => {
                            if (err)
                                console.log(err);
                            else {
                                files.forEach(file => {
                                    fs.copyFile(path.join(__dirname, 'assets', nameDir, file), path.join(__dirname, 'project-dist', 'assets', nameDir, file),(err) => {
                                if (err) throw err;})
                                })
                    }})
                }    
                }) 
            })
        })
    console.log("файлы из assets скопированы");
    }}
)


const outputCSS = fs.createWriteStream(path.join(__dirname,'project-dist','style.css'));
fs.readdir(path.join(__dirname, 'styles'),          // чтение и копирование стилей
{ withFileTypes: true },
    (err, files) => {
        if (err)
            console.log(err);
            else {
                const filesFilter = files.filter(item => path.extname(item.name) === '.css');
                filesFilter.forEach(file => {
                    const readStyle = fs.createReadStream(path.join(__dirname,'styles', file.name),'utf-8');
                    readStyle.on('data', data => {
                        outputCSS.write(data+'\n'+'\n')
                 });
                   
            })
            console.log("стили скопированы")
    }}
)

//  ------------------------------------------- запись в html ---------------------------------------------------- 

// создать файл переменную
// записать туда из темплейт
// цикл с реплейс

async function f() {

    await function () {
        const outputTest = fs.createWriteStream(path.join(__dirname,'test.html'));
        const readableStream = fs.createReadStream(path.join(__dirname,'template.html'),'utf-8');
        readableStream.on('data', chunk => outputTest.write(chunk));
        return;
    }();
    const outputHTML = fs.createWriteStream(path.join(__dirname,'project-dist','index.html'));
    let dataTest = await fs.promises.readFile(path.join(__dirname,'test.html'), (err) => {if (err) console.log(err)});
    let dataStr = dataTest.toString().split(/\r\n|\r|\n/g);
    let some = dataStr.join('\n');

    for (let item of dataStr) {
        if (item.match(/{?{\w{1,20}}?}/g)) {
            let tag = item.trim().slice(2,-2);
            let fileHTMLName = (tag + '.html');
            let elem = await fs.promises.readFile(path.join(__dirname, 'components', fileHTMLName));
            let elemStr =  elem.toString();
            some = some.replace(item, elemStr);   
        }
    }
    outputHTML.write(some+'\n');
    outputHTML.close();
    fs.unlink(path.join(__dirname,'test.html'), err => {if (err) throw err;})
}
f();
