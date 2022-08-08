const vrchat = require("vrchat");
const cfg = require("./configmanager");
const main = require("./main");

const configuration = new vrchat.Configuration({
    username: cfg.getConfig().username,
    password: cfg.getConfig().password
});

const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
const UsersApi = new vrchat.UsersApi(configuration);
const WorldsApi = new vrchat.WorldsApi(configuration);

let userid = "";

let authData;
let userData;
let worldData;

this.user = "Unknown";

let user = "Unknown";




AuthenticationApi.getCurrentUser().then(resp => {
    const currentUser = resp.data;
    main.log(`[VA] Logged in as: ${currentUser.displayName}`);
    //console.log(currentUser);

    user = currentUser.displayName;

    userid = currentUser.id;
    authData = currentUser;

    this.updateCurrentWorld();

})
.catch(err => { 
    main.log("[VA] \u001b[31mERROR ERROR ERROR\u001b[0m");
    main.log(`[VA] ERROR: Failed to log in. Please restart VRCPM and try again.`);
}
);

let currentWorld = "an unknown world";
let currentWorldId = "0000";

this.updateCurrentWorld = () => {
    UsersApi.getUser(userid).then(resp => {
        let worldId = resp.data.worldId;
        if(!resp.data.worldId || resp.data.worldId == "traveling" || resp.data.worldId == "offline") {
            main.log("[VA] Can't get current world (" + resp.data.worldId + ")");
           
            return;
        }else{
            WorldsApi.getWorld(resp.data.worldId).then(resp => {
                currentWorldId = worldId;
                worldData = resp.data;
    
                currentWorld = worldData.name;
    
                main.log(`[VA] Logged in as: ${authData.displayName}`);
                main.log(`[VA] Currently in world: ${worldData.name}`);
    
            });
        }

    });
}



setInterval(() => {
    this.updateCurrentWorld();
}, 30 * 1000);

function getCurrentWorld() {
    return currentWorld;
}

function getCurrentWorldId() {
    return currentWorldId;
}

function getUser(){
    return user;
}

module.exports = {...this, currentWorld, currentWorldId, getCurrentWorld, getCurrentWorldId, getUser};