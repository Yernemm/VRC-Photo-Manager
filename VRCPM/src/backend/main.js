const fs = require('fs');

const {ipcMain} = require('electron');

const config = require('../config.json');

let mainWindow = undefined;

function onDetect(path){
    log("[MAIN] Photo detected.");
    console.log("hi");
    fs.stat(path, (err, stats) => {

        console.log(stats);

        duploader.uploadImage(path, vrchatapi.getUser(), vrchatapi.getCurrentWorld(), vrchatapi.getCurrentWorldId(), Math.floor(stats.mtimeMs / 1000));

    });
}

async function main(window){

    mainWindow = window;

    let duploader = require('./discorduploader');
    let fwatcher = require('./folderwatcher');
    let vrchatapi = require('./vrchatapi');
    let cfg = require('./configmanager');

    duploader.startWebhook(config.webhook);
    fwatcher.watch(onDetect);

    setTimeout(() => {
        
        log("[MAIN] " + vrchatapi.getCurrentWorld());
    }, 3000);

}

function log(message){
    //get current time in square brackets
    let time = "[" + new Date().toLocaleTimeString() + "] ";
    
    mainWindow.webContents.send('console-log', time + message);
}



module.exports = {...this, log, main};