const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const del = require('del');

const argv = yargs
    .usage('Usage $0 [options]')
    .help('help')
    .alias('help', 'h')
    .version('0.0.1')
    .alias('version', 'v')
    .example('$0 --entry ./filesDir -d')
    .option('entry',{
        alias:'e',
        describe:'The path of source directory',
        demandOption: true
    })
    .option('output',{
        alias:'o',
        describe:'The path of output directory',
        default: '/dest'
    })
    .option('delete',{
        alias: 'd',
        describe:'Delete source directiory',
        default: false
    })
    .argv

    console.log('copying...');




const src = path.normalize(path.join(__dirname,argv.entry));
const dest = path.normalize(path.join(__dirname,argv.output));
const deleting = argv.delete;

const promises = [];




const readDir=(base)=>{
    return new Promise((resolve,reject)=>{
        fs.readdir(base,(err,data)=>{
            if(err){reject(err)};
            resolve(data);
        })
    })
}

const isFolder = async currentURL=>{
    return new Promise((resolve,reject)=>{
    
        fs.stat(currentURL,(err,stat)=>{
            if(err){reject(err)};
            resolve(stat.isDirectory());
        });
    })
};

const createDir = path =>{
   if(!fs.existsSync(path)){
       fs.mkdirSync(path);
   }
}

const copyFiles = async src=>{
    const files = await readDir(src);
    
    for(let i=0; i < files.length; i++){
        let localBase = path.join(src,files[i]);
        let isDir = await isFolder(localBase);

        if(isDir){
            await copyFiles(localBase);
        }else{
            promises.push(new Promise((resolve,reject)=>{
                let newSubFolder = path.join(dest,files[i].toString().split('')[0]);
                createDir(dest);
                createDir(newSubFolder);
                fs.copyFileSync(localBase,`${newSubFolder}/${files[i]}`);
                fs.unlink(localBase,()=>{
                    resolve();
                });
            }));
        }
    }
} 

const searchFiles = async src =>{
    await copyFiles(src);

    return Promise.all(promises);
}

searchFiles(src)
    .then(()=>{
        console.log('********************* Copying finished *******************');
        if(deleting==='true'){
            del(`${path.join(src, path.sep)}**`);
            console.log(`Source dir was DELETE! `);
        }
    });


   