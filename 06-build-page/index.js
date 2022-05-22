const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
util = require("util");
const { stdin, stdout } = process;
const readline = require('readline');

/*

fs.rm(path.join(__dirname, 'project-dist', 'assets'),
 { recursive: true, 
 force: true}, (err) => {
     if (err)    console.log(err);})

*/

fs.mkdir(path.join(__dirname, 'project-dist'),  // создание assets в project-dist
            { recursive: true }, () => {
                console.log('папка project-dist создана');
            });

fs.readdir(path.join(__dirname, 'assets'),           //читаем папку assets
    (err, files) => {
         if (err) 
            {console.log(err)}
        else {
            fs.rm(path.join(__dirname, 'project-dist', 'assets'),
                { recursive: true, 
                force: false}, (err) => {
                    if (err) {fs.mkdir(path.join(__dirname, 'project-dist', 'assets'),  // создание assets в project-dist
                    { recursive: true }, () => {
                        console.log('папка assets создана');
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
                   // console.log(nameDir)
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
                        outputCSS.write(data+'\n')
                 });
                   
            })
            console.log("стили скопированы")
    }}
)

//  ------------------------------------------- запись в html ---------------------------------------------------- 

// создать файл переменную
// записать туда из темплате
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
   // console.log(dataStr, some)

    for (let item of dataStr) {
        if (item.match(/{?{\w{1,20}}?}/g)) {
            let tag = item.trim().slice(2,-2);
            let fileHTMLName = (tag + '.html');
            let elem = await fs.promises.readFile(path.join(__dirname, 'components', fileHTMLName));
            let elemStr =  elem.toString();

            some = some.replace(item, elemStr); 
        //  console.log(typeof some)
            
        }
    }
outputHTML.write(some+'\n');
outputHTML.close();
fs.unlink(path.join(__dirname,'test.html'), err => {if (err) throw err;})
}
f();







/*

var ws = fs.createWriteStream(path.join(__dirname,'project-dist','test.html'));
var rl = readline.createInterface({
input: fs.createReadStream(path.join(__dirname,'template.html'))
});

rl.on('line', function (line) {
    
    if (line.includes('{{')) {
        let newStr = line.trim().slice(2,-2);
        let some = readComp(newStr);
        console.log(some + 'bfbfdbd\n');
        str = line.replace(line, some+'\n');
        ws.write( str)
    } else
 ws.write(line + '\n');
    });

rl.on('close', function() {
ws.close()
})

async function readComp(str) {
    let fileHTMLName = (str + '.html');
    let dataComp = await fs.promises.readFile(path.join(__dirname, 'components', fileHTMLName), 'utf-8');
    return dataComp;
}


/*
async function readComp(str) {
    let fileHTMLName;
     await fs.readdir(path.join(__dirname, 'components'),
    //        { withFileTypes: true },
                (err, files) => {
                    if (err)
                        console.log(err);
                        else {
                            let fileHTML = files.filter(item => path.basename(item, path.extname(item)) === str);
                            fileHTMLName = fileHTML.toString().trim();
                           // console.log(fileHTMLName)                            
                        }})
    return fileHTMLName;                    

/*

const outputHTML = fs.createWriteStream(path.join(__dirname,'project-dist','index.html'));
const outputTemp = fs.createWriteStream(path.join(__dirname,'project-dist','index.html'));

async function f() {

let dataTemp = await fs.promises.readFile(path.join(__dirname, 'template.html'), (err) => {if (err) console.log(err)});
let dataStr = await dataTemp.toString().split(/\r\n|\r|\n/g);
return dataStr;
}

async function g() {
    dataStr = await f()
    for (let i = 0; i < dataStr.length; i++) {
    if (dataStr[i].includes('{{')) {
        
        let newStr = dataStr[i].trim().slice(2,-2);
        fs.readdir(path.join(__dirname, 'components'),
    //        { withFileTypes: true },
                (err, files) => {
                    if (err)
                        console.log(err);
                        else {
                            let fileHTML = files.filter(item => path.basename(item, path.extname(item)) === newStr);
                            let fileHTMLName = fileHTML.toString().trim();
                            const readHTML = fs.createReadStream(path.join(__dirname,'components', fileHTMLName),'utf-8');
                            readHTML.on('data', data => outputHTML.write(data));  
                }}
            )
     } else {outputTemp.write(dataStr[i]+'\n');
                }
}
}

g()


const outputHTML = fs.createWriteStream(path.join(__dirname,'project-dist','index.html'));
const readableStream = fs.createReadStream(path.join(__dirname,'template.html'),'utf-8');
readableStream.on('data', chunk => outputHTML.write(chunk));

async function readComp(str) {
    let fileHTMLName = (str + '.html');
    let dataComp = await fs.promises.readFile(path.join(__dirname, 'components', fileHTMLName), 'utf-8');
    return dataComp;
}


var ws = fs.createWriteStream(path.join(__dirname,'project-dist','index.html'))
var rl = readline.createInterface({
input: fs.createReadStream(path.join(__dirname,'template.html'))
});
    
    
rl.on('line', function (line) {
    if (line.toString().match(/{?{\w{1,20}}?}/g)) {
    var newLine = line.replace(line, '$1< script> </script>');
    ws.write(newLine + '\n', 'utf8', function () {
    // console.log (1)
        });
    } else {
    ws.write(line + '\n', 'utf8', function () {
    //   console.log(2)
        });
        }
    });
*/
       
