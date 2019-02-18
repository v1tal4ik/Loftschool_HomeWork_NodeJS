const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const Observable = require('./libs/observer');
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

    console.log(argv);




const src = path.normalize(path.join(__dirname,argv.entry));
const dest = path.normalize(path.join(__dirname,argv.output));
const deleting = argv.delete;

const observable = new Observable(()=>{
    console.log('*********************** Copying finished ****************************');

    if(deleting==='true'){
        del.sync(`${path.join(src, path.sep)}**`);
        console.log('delete source directory');
    }
});


const readDir=(base,dest,deleting,level)=>{
    try{
        observable.addObserver(base);

        //Создание итоговой папки если ее нет
        fs.exists(dest,(result)=>{
            if(!result){
                fs.mkdir(dest,{recursive:true},err=>{
                    if(err){console.log(err)};
                })
            }
        })


        fs.readdir(base,(err,data)=>{
            if(err){console.log(err)};

            //data == содержимое папки base
            data.forEach(item=>{
                let localBase = path.join(base,item);
                observable.addObserver(localBase);


                //свойства Item(файла или папки)
                fs.stat(localBase,(err,state)=>{
                    if(err){console.log(err)};

                    if(state.isDirectory()){
                        readDir(localBase,dest,deleting,level+1)//рекурсия если ето папка
                        observable.removeObserver(localBase);
                    }else{
                        //если ето файл
                        let letter = item.toString().split('')[0];//вичисляем первую букву
                        fs.exists(`${dest}/${letter}`,(result)=>{
                            if(!result){
                                fs.mkdir(`${dest}/${letter}`,{recursive:true},err=>{
                                    if(err){console.log(err)};
                                });
                                fs.copyFile(localBase,`${dest}/${letter}/${item}`,err=>{
                                    if(err){console.log(err)};

                                    console.log(`Файл ${localBase} - was copied!`);
                                    observable.removeObserver(localBase);
                                });
                                return 0;
                            }else{
                                fs.copyFile(localBase,`${dest}/${letter}/${item}`,err=>{
                                    if(err){console.log(err)};

                                    console.log(`Файл ${localBase} - was copied!`);
                                    observable.removeObserver(localBase);
                                });
                                return 0;
                            }

                            
                        });
                    }
                });
                
            });
            observable.removeObserver(base);
        });
    }catch{
        console.log('Ошибка! Возможно путь к папке указан не верно или такой папки не существует!');
        return;
    }
}

readDir(src,dest,deleting,0);
observable.start('copying files...');

   