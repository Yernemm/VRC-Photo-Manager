const chokidar = require('chokidar');
const main = require("./main");
const cfg = require("./configmanager");

const path = require('path');
const fs = require('fs');
const homedir = require('os').homedir();

function getDefaultFolder(){
    const native = path.join(homedir, "Pictures", "VRChat");
    if (process.platform !== 'linux') return native;
    // On Linux VRChat runs through Steam Proton; look for its Wine prefix.
    const steamRoots = [
        path.join(homedir, ".local", "share", "Steam"),
        path.join(homedir, ".steam", "steam"),
        path.join(homedir, ".var", "app", "com.valvesoftware.Steam", ".local", "share", "Steam")
    ];
    for (const root of steamRoots) {
        const users = path.join(root, "steamapps", "compatdata", "438100", "pfx", "drive_c", "users");
        for (const u of ["steamuser", "Public"]) {
            const p = path.join(users, u, "Pictures", "VRChat");
            if (fs.existsSync(p)) return p;
        }
    }
    return native;
}
const defaultFolder = getDefaultFolder();

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
        .on('add' ,filePath =>{
            if(/[\\/]Prints[\\/]/.test(filePath)) {
                main.log("[FW] Detected new print. Ignoring.");
                return;
            }
            if(/[\\/]Stickers[\\/]/.test(filePath)) {
                main.log("[FW] Detected new sticker. Ignoring.");
                return;
            }
            main.log("[FW] Detected new photo: " + filePath);
            onDetect(filePath);
        });
}

module.exports = this;