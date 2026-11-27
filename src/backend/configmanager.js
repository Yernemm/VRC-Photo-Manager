const fs = require('fs');
const main = require("./main");
const {ipcMain} = require('electron');

const path = require('path');
const os = require('os');

//config location: %APPDATA% on Windows, ~/Library/Application Support on macOS, $XDG_CONFIG_HOME or ~/.config on Linux
let appdata;
if (process.platform === 'win32') {
    appdata = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
} else if (process.platform === 'darwin') {
    appdata = path.join(os.homedir(), "Library", "Application Support");
} else {
    appdata = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
}
const configDir = path.join(appdata, "Yernemm", "VRCPM");
const configFile = path.join(configDir, "config1.json");

//create if not exists folder Yernemm/VRCPM
if (!fs.existsSync(configDir)) {
    main.log("[CM] Creating config folder...");
    fs.mkdirSync(configDir, { recursive: true });
}

//create if not exists config file
if (!fs.existsSync(configFile)) {
    main.log("[CM] Creating config file...");
    fs.writeFileSync(configFile, "{}");
}

function readConfig(){
    return JSON.parse(fs.readFileSync(configFile, "utf8"));
}

let config = readConfig();

function writeConfig(webhook){
    main.log("[CM] Writing config...");
    config.webhook = webhook;
    fs.writeFileSync(configFile, JSON.stringify(config));
}

function getConfig(){
    return config;
}

function reloadConfig(){
    main.log("[CM] Reloading config...");
    config = readConfig();
}

function mergeConfig(newConfig){
    config = {...config, ...newConfig};
}

function setConfig(webhook){
    main.log("[CM] Setting config...");
    config = {webhook};
}

function saveConfig(){
    main.log("[CM] Saving config...");
    try{
        fs.writeFileSync(configFile, JSON.stringify(config));
    }catch(e){
        main.error("C-001", "Error saving config: " + e);
    }
}

function isLoaded(){
    return config.webhook != undefined;
}

ipcMain.on("open-config", (event, details) =>{
    main.log("[CM] Opening config...");
    //open file manager window to the config folder
    require('electron').shell.openPath(configDir);
});

// Used by the settings screen to show the currently saved values.
ipcMain.handle("get-config", () => {
    return {
        webhook: config.webhook,
        photopath: config.photopath,
        autoUpload: config.autoUpload !== false
    };
});


ipcMain.handle("set-auto-upload", (event, enabled) => {
    config.autoUpload = enabled === true;
    main.log("[CM] Automatic upload " + (config.autoUpload ? "enabled" : "disabled") + ".");
    saveConfig();
    return config.autoUpload;
});

module.exports = {...this, config, writeConfig, getConfig, reloadConfig, setConfig, saveConfig, isLoaded, mergeConfig};
