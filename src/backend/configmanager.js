const fs = require('fs');
const main = require("./main");
const {ipcMain} = require('electron');

//get appdata location
const appdata = require('os').homedir() + "\\AppData\\Roaming";

//create if not exists folder %appdata%\Yernemm\VRCPM
if (!fs.existsSync(appdata + "\\Yernemm")) {
    main.log("[CM] Creating Yernemm software folder...");
    fs.mkdirSync(appdata + "\\Yernemm");
}

//create if not exists folder %appdata%\Yernemm\VRCPM
if (!fs.existsSync(appdata + "\\Yernemm\\VRCPM")) {
    main.log("[CM] Creating config folder...");
    fs.mkdirSync(appdata + "\\Yernemm\\VRCPM");
}

//create if not exists file %appdata%\Yernemm\VRCPM\config1.json
if (!fs.existsSync(appdata + "\\Yernemm\\VRCPM\\config1.json")) {
    main.log("[CM] Creating config file...");
    fs.writeFileSync(appdata + "\\Yernemm\\VRCPM\\config1.json", "{}");
}

let config = require(appdata + "\\Yernemm\\VRCPM\\config1.json");

function writeConfig(webhook){
    main.log("[CM] Writing config...");
    config.webhook = webhook;
    fs.writeFileSync(appdata + "\\Yernemm\\VRCPM\\config1.json", JSON.stringify(config));
}

function getConfig(){
    return config;
}

function reloadConfig(){
    main.log("[CM] Reloading config...");
    config = require(appdata + "\\Yernemm\\VRCPM\\config1.json");
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
        fs.writeFileSync(appdata + "\\Yernemm\\VRCPM\\config1.json", JSON.stringify(config));
    }catch(e){
        main.error("C-001", "Error saving config: " + e);
    }
}

function isLoaded(){
    return config.webhook != undefined;
}

ipcMain.on("open-config", (event, details) =>{
    main.log("[CM] Opening config...");
    //open explorer window to the config folder
    require('child_process').exec('explorer ' + appdata + "\\Yernemm\\VRCPM");
});

module.exports = {...this, config, writeConfig, getConfig, reloadConfig, setConfig, saveConfig, isLoaded, mergeConfig};
