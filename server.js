const fs = require('fs');
const path = require('path');


const src = path.join(process.argv[1],process.argv[2]);
const dest = path.join(process.argv[1],process.argv[3]);
const deleting = process.argv[4];



const readDir=(base,dest,deleting,level)=>{
    try{
        if(!fs.existsSync(dest)){
            fs.mkdirSync(dest);
        }


        const files = fs.readdirSync(base);

        files.forEach(item => {
            let localBase = path.join(base,item);
            let state = fs.statSync(localBase);
            
            if(state.isDirectory()){
                readDir(localBase,dest,deleting,level+1);
            }else{
                let letter = item.toString().split('')[0];

                if(!fs.existsSync(`${dest}/${letter}`)){
                    fs.mkdirSync(`${dest}/${letter}`);
                };

                fs.copyFileSync(localBase,`${dest}/${letter}/${item}`);
            }
        });

    }catch(error){
        console.log(error);
    }
}
readDir(src,dest,deleting,0);

   