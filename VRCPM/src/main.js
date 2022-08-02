const fs = require('fs');
let duploader = require('./discorduploader');
let fwatcher = require('./folderwatcher');

const config = require('./config.json');

duploader.startWebhook(config.webhook);

fwatcher.watch(onDetect);

function onDetect(path){
    console.log("hi");
    fs.stat(path, (err, stats) => {

        console.log(stats);

        duploader.uploadImage(path, "Yernemm", "an unknown world", Math.floor(stats.mtimeMs / 1000));

    });
}