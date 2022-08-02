const fs = require('fs');
let duploader = require('./discorduploader');
let fwatcher = require('./folderwatcher');

duploader.startWebhook("");

fwatcher.watch(onDetect);

function onDetect(path){
    console.log("hi");
    fs.stat(path, (err, stats) => {

        console.log(stats);

        duploader.uploadImage(path, "Yernemm", "Unknown World", Math.floor(stats.mtimeMs / 1000));

    });
}