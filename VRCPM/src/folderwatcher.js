const chokidar = require('chokidar');

const homedir = require('os').homedir();
const defaultFolder = homedir + "\\Pictures\\VRChat";

console.log(defaultFolder);

this.watch = (onDetect) =>{
    folder = defaultFolder
    chokidar.watch(folder, {ignoreInitial: true})
        .on('add' ,path =>{
            console.log(path);
            onDetect(path);
        });
}

module.exports = this;