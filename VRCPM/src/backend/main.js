let duploader;duploader
let fwatcher;
let cfg;
var pngitxt = require('png-itxt');

let stuffStarted = false;

const fs = require('fs');

const {ipcMain} = require('electron');

let mainWindow = undefined;

// Last known author/world, cached from VRCX metadata so photos
// without their own metadata can reuse it instead of "Unknown".
let lastUser = "Unknown";
let lastWorld = "an unknown world";
let lastWorldId = "0000";

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

// Read every iTXt chunk in a single pass and return them keyed by keyword.
// VRChat writes the "Author"/"WorldID"/"WorldDisplayName" tags
// VRCX creates the big "Description" JSON blob (the only one carrying the
// full player list), so we grab them all and decide afterwards.
function readItxtChunks(path){
    return new Promise((resolve) => {
        let chunks = {};
        let done = false;
        let finish = () => { if(!done){ done = true; resolve(chunks); } };

        let stream = fs.createReadStream(path);
        // Passing no keyword makes the callback fire once per iTXt chunk.
        let duplex = stream.pipe(pngitxt.getitxt((err, data) => {
            if(!err && data && data.keyword){
                chunks[data.keyword] = data.value;
            }
        }));

        // Drain the encoder side so the stream keeps flowing past IDAT.
        duplex.resume();
        duplex.on('finish', finish);
        duplex.on('end', finish);
        duplex.on('error', finish);
        stream.on('error', finish);
    });
}

// VRChat embeds its native author/world tags as XMP XML inside the single
// "XML:com.adobe.xmp" iTXt chunk, not as separate keyworded chunks.
function unescapeXml(s){
    return s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
        .replace(/&amp;/g, '&');
}

function xmpTag(xmp, localName){
    // Match <ns:LocalName>value</ns:LocalName> for any namespace prefix.
    let m = xmp.match(new RegExp('<\\w+:' + localName + '>([\\s\\S]*?)</\\w+:' + localName + '>'));
    return m ? unescapeXml(m[1].trim()) : undefined;
}

function parseVrcXmp(xmp){
    if(!xmp) return {};
    return {
        author: xmpTag(xmp, 'Author'),
        world: xmpTag(xmp, 'WorldDisplayName'),
        worldId: xmpTag(xmp, 'WorldID')
    };
}

async function onDetect(path){
    log("[MAIN] Photo detected.");
    console.log("hi");
    await delay(1000);
    fs.stat(path, async (err, stats) => {

        if(err){
            error("M-001", "Error getting file stats.");
            return;
        }

        console.log(stats);

        //Ignore non-pngs
        if(!path.endsWith('.png')){
            uploadNonVrcx(stats, path);
            return;
        }

        let chunks = await readItxtChunks(path);

        console.log(chunks);

        // Built-in VRChat XMP tags take precedence; only fall back to
        // Description for any of these that weren't present.
        let builtin = parseVrcXmp(chunks['XML:com.adobe.xmp']);
        let author = builtin.author;
        let world = builtin.world;
        let worldId = builtin.worldId;

        let moreInfo = null;

        // Description carries the full player list and serves as the
        // fallback source for author/world when the tags above are missing.
        if(chunks['Description']){
            try{
                let desc = JSON.parse(chunks['Description']);

                //console.log(desc);

                if(Array.isArray(desc.players) && desc.players.length){
                    moreInfo = "**[VRCX]** Users: `";
                    desc.players.forEach(player => {moreInfo += player.displayName + ", "});
                    moreInfo = moreInfo.slice(0, -2);
                    moreInfo += "`";
                }

                if(!author && desc.author) author = desc.author.displayName;
                if(!world && desc.world) world = desc.world.name;
                if(!worldId && desc.world) worldId = desc.world.id;
            }catch{
                // Malformed Description: keep whatever the built-in tags gave us.
            }
        }

        // No VRCX/VRChat metadata at all -> reuse last known author/world.
        if(!author && !world && !worldId){
            uploadNonVrcx(stats, path);
            return;
        }

        // Cache resolved values for later photos that lack metadata.
        if(author) lastUser = author;
        if(world) lastWorld = world;
        if(worldId) lastWorldId = worldId;

        duploader.uploadImage(path, lastUser, lastWorld, lastWorldId, Math.floor(stats.mtimeMs / 1000), moreInfo);
    });
}

function uploadNonVrcx(stats, path){
    duploader.uploadImage(path, lastUser, lastWorld, lastWorldId, Math.floor(stats.mtimeMs / 1000));
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

    log("VRCPM Version 0.5.0");
    log("Changes:");
    log("-Removed VRChat login. metadata now comes only from VRCX data and built-in VRChat tags.");
    log("-Photos without data reuse the last known author/world.");
    //log("-Visual Redesign");
    //log("-Added a custom photo folder setting");
    //log("-Added support for VRCX Screenshot Helper data");
    //log("-New icon");
    log(`
=============================================\u001b[0m`)

    if(cfg.isLoaded()){
        startWithConfig();
    }else{
        log("[MAIN] No saved config found. Please set your Discord webhook in Settings.");
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

    duploader.startWebhook(cfg.getConfig().webhook);
    fwatcher.watch(onDetect);
}

ipcMain.on("save-button", (event, details) =>{
    log("[MAIN] Save button pressed.");
    let newValues = pruneObject(details);
    cfg.mergeConfig(newValues);
    log("[MAIN] Setting new values for: " + Object.keys(newValues));
    cfg.saveConfig();
});

function pruneObject(object){
    let newObj = {...object};
    Object.keys(newObj).forEach(
        (key) => (newObj[key] === "") && delete newObj[key]);
    return newObj;
}



module.exports = {...this, log, error, alert, main};