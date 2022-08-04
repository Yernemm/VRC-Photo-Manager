const fs = require('fs');
let duploader = require('./discorduploader');
let fwatcher = require('./folderwatcher');
let vrchatapi = require('./vrchatapi');

const config = require('./config.json');

duploader.startWebhook(config.webhook);

fwatcher.watch(onDetect);

setTimeout(() => {
    console.log(vrchatapi.getCurrentWorld());
}, 3000);

function onDetect(path){
    console.log("hi");
    fs.stat(path, (err, stats) => {

        console.log(stats);

        duploader.uploadImage(path, vrchatapi.getUser(), vrchatapi.getCurrentWorld(), vrchatapi.getCurrentWorldId(), Math.floor(stats.mtimeMs / 1000));

    });
}