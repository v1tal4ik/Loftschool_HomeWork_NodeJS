const fs = require('fs');
const path = require('path');


const src = path.join(process.argv[1],process.argv[2]);
const dest = path.join(process.argv[1],process.argv[3]);
const deleting = process.argv[4];
var counter=0;
var length=0;



const readDir=(base,dest,deleting,level)=>{
    try{
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

            //data== содержимое папки base
            data.forEach(item=>{
                let localBase = path.join(base,item);

                //свойства Item(файла или папки)
                fs.stat(localBase,(err,state)=>{
                    if(err){console.log(err)};

                    if(state.isDirectory()){
                        readDir(localBase,dest,deleting,level+1)//рекурсия если ето папка
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
                                });
                                return;
                            }else{
                                fs.copyFile(localBase,`${dest}/${letter}/${item}`,err=>{
                                    if(err){console.log(err)};
                                });
                                return 0;
                            }

                            
                        });
                    }
                });
                
            });
        });
    }catch{
        console.log('Ошибка! Возможно путь к папке указан не верно или такой папки не существует!');
        return;
    }
}
readDir(src,dest,deleting,0);

   