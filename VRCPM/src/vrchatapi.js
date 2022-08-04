const vrchat = require("vrchat");
const config = require("./config.json");

const configuration = new vrchat.Configuration({
    username: config.username,
    password: config.password
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
    console.log(`Logged in as: ${currentUser.displayName}`);
    //console.log(currentUser);

    user = currentUser.displayName;

    userid = currentUser.id;
    authData = currentUser;

    this.updateCurrentWorld();

});

let currentWorld = "an unknown world";
let currentWorldId = "0000";

this.updateCurrentWorld = () => {
    UsersApi.getUser(userid).then(resp => {
        let worldId = resp.data.worldId;
        if(!resp.data.worldId || resp.data.worldId == "traveling") {
            console.log("Can't get current world (likely travelling)");
           
            return;
        }else{
            WorldsApi.getWorld(resp.data.worldId).then(resp => {
                currentWorldId = worldId;
                worldData = resp.data;
    
                currentWorld = worldData.name;
    
                console.log(`Logged in as: ${authData.displayName}`);
                console.log(`Currently in world: ${worldData.name}`);
    
            });
        }

    });
}



setInterval(() => {
    this.updateCurrentWorld();
}, 60 * 1000);

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