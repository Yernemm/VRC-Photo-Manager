let duploader;duploader
let fwatcher;
let vrchatapi;
let cfg;

let stuffStarted = false;

const fs = require('fs');

const {ipcMain} = require('electron');

let mainWindow = undefined;

function onDetect(path){
    log("[MAIN] Photo detected.");
    console.log("hi");
    fs.stat(path, (err, stats) => {

        if(err){
            error("M-001", "Error getting file stats.");
            return;
        }

        console.log(stats);

        duploader.uploadImage(path, vrchatapi.getUser(), vrchatapi.getCurrentWorld(), vrchatapi.getCurrentWorldId(), Math.floor(stats.mtimeMs / 1000));

    });
}

async function main(window){

    

    mainWindow = window;
    cfg = require('./configmanager');
    log(`\u001b[94m
=============================================`)
    log(`
    __      __ _____    _____  _____   __  __ 
    \\ \\    / /|  __ \\  / ____||  __ \\ |  \\/  |
     \\ \\  / / | |__) || |     | |__) || \\  / |
      \\ \\/ /  |  _  / | |     |  ___/ | |\\/| |
       \\  /   | | \\ \\ | |____ | |     | |  | |
        \\/    |_|  \\_\\ \\_____||_|     |_|  |_|
                                                                                             
    `)

    log("VRCPM Version 0.2");
    log("Changes:");
    log("-Better error and alert logging");
    log("-Slightly better UI");
    log(`
=============================================\u001b[0m`)

    if(cfg.isLoaded()){
        startWithConfig();
    }else{
        log("[MAIN] No saved config found. Please log in.");
    }


}

function log(message){
    //get current time in square brackets
    let time = "[" + new Date().toLocaleTimeString() + "] ";
    
    mainWindow.webContents.send('console-log', time + message);
}

function error(code, message){
    //let time = "[" + new Date().toLocaleTimeString() + "] ";
    let msg = `\u001b[91m[ERROR CODE ${code}] ${message}\u001b[0m`
    log(msg);

    //mainWindow.webContents.send('console-log', time + message);
}

function alert(message){
    let msg = `\u001b[93m{Alert} ${message}\u001b[0m`
    log(msg);
}

function startWithConfig(){
    if(stuffStarted) return;

    if(!cfg.isLoaded()){
        log("[MAIN] Config not loaded.");
        return;
    }

    stuffStarted = true;

    duploader = require('./discorduploader');
    fwatcher = require('./folderwatcher');
    vrchatapi = require('./vrchatapi');

    duploader.startWebhook(cfg.getConfig().webhook);
    fwatcher.watch(onDetect);

    setTimeout(() => {
        
        log("[MAIN] " + vrchatapi.getCurrentWorld());
    }, 3000);
}

ipcMain.on("login-button", (event, details) =>{
    log("[MAIN] Login button pressed.");
    cfg.setConfig(
        details.username,
        details.password,
        details.webhook
    );

    startWithConfig();
})

ipcMain.on("save-button", (event, details) =>{
    log("[MAIN] Save button pressed.");
    cfg.saveConfig();
});




module.exports = {...this, log, error, alert, main};