const chokidar = require('chokidar');
const main = require("./main");
const cfg = require("./configmanager");

const homedir = require('os').homedir();
const defaultFolder = homedir + "\\Pictures\\VRChat";

main.log("[FW] Folder watcher started");

let actualFolder;

if(cfg.config.photopath){
    main.log("[FW] Custom photo folder set to " + cfg.config.photopath);
    actualFolder = cfg.config.photopath;
}else{
    main.log("[FW] Default photo folder set to " + defaultFolder);
    actualFolder = defaultFolder;
}



this.watch = (onDetect) =>{
    folder = actualFolder
    chokidar.watch(folder, {ignoreInitial: true})
        .on('add' ,path =>{
            main.log("[FW] Detected new photo: " + path);
            onDetect(path);
        });
}

module.exports = this;