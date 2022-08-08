const chokidar = require('chokidar');
const main = require("./main");

const homedir = require('os').homedir();
const defaultFolder = homedir + "\\Pictures\\VRChat";

main.log("[FW] Folder watcher started");
main.log("[FW] Default photo folder set to " + defaultFolder);


this.watch = (onDetect) =>{
    folder = defaultFolder
    chokidar.watch(folder, {ignoreInitial: true})
        .on('add' ,path =>{
            main.log("[FW] Detected new photo: " + path);
            onDetect(path);
        });
}

module.exports = this;