const fs = require('fs');

//get appdata location
const appdata = require('os').homedir() + "\\AppData\\Roaming";

//create if not exists folder %appdata%\Yernemm\VRCPM
if (!fs.existsSync(appdata + "\\Yernemm\\VRCPM")) {
    fs.mkdirSync(appdata + "\\Yernemm\\VRCPM");
}

//create if not exists file %appdata%\Yernemm\VRCPM\config1.json
if (!fs.existsSync(appdata + "\\Yernemm\\VRCPM\\config1.json")) {
    fs.writeFileSync(appdata + "\\Yernemm\\VRCPM\\config1.json", "{}");
}

let config = require(appdata + "\\Yernemm\\VRCPM\\config1.json");

function writeConfig(username, password, webhook){
    config.username = username;
    config.password = password;
    config.webhook = webhook;
    fs.writeFileSync(appdata + "\\Yernemm\\VRCPM\\config1.json", JSON.stringify(config));
}

function getConfig(){
    return config;
}

function reloadConfig(){
    config = require(appdata + "\\Yernemm\\VRCPM\\config1.json");
}

function setConfig(username, password, webhook){
    config = {username, password, webhook};
}

function saveConfig(){
    fs.writeFileSync(appdata + "\\Yernemm\\VRCPM\\config1.json", JSON.stringify(config));
}



module.exports = {...this, config, writeConfig, getConfig, reloadConfig, setConfig, saveConfig};
