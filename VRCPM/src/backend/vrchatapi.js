const vrchat = require("vrchat");
const cfg = require("./configmanager");
const main = require("./main");
const {ipcMain} = require('electron');

const axios =require( 'axios')
const Cookie = require( 'tough-cookie').Cookie

const configuration = new vrchat.Configuration({
    username: cfg.getConfig().username,
    password: cfg.getConfig().password,
});

const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
const UsersApi = new vrchat.UsersApi(configuration);
const WorldsApi = new vrchat.WorldsApi(configuration);

if(cfg.getConfig().fa){
    setAuthCookie(cfg.getConfig().fa)
}

let userid = "";

let authData;
let userData;
let worldData;

this.user = "Unknown";

let user = "Unknown";

let fatype = null;

const faTypes = {
    "emailOtp": "Email OTP",
    "totp": "Authenticator App",
    "otp": "Recovery Code"
}

ipcMain.on("verify2fa", (event, details) => {
    
    const token = details + "";
    main.log(`[VA] Verifying 2FA with token "${token}"...`);
    switch(fatype){
        case "emailOtp": 
            AuthenticationApi.verify2FAEmailCode({code: token}).then(val => faSuccess(val)).catch(val=> faFail(val)); 
            break;
        case "totp": 
            AuthenticationApi.verify2FA(token).then(val => faSuccess(val)).catch(val=> faFail(val)); 
            break;
        case "otp": 
            AuthenticationApi.verifyRecoveryCode(token).then(val => faSuccess(val)).catch(val=> faFail(val)); 
            break;
        default: 
            main.alert("[VA] No 2FA method detected... (" + fatype + ")"); 
            break;
    }
    
});

getTheUser();

function getTheUser(){

    AuthenticationApi.getCurrentUser().then(resp => {
        const currentUser = resp.data;
    
        if(currentUser.requiresTwoFactorAuth){
            main.alert("[VA] This account requires 2FA to log in: " + (faTypes[currentUser.requiresTwoFactorAuth] ? faTypes[currentUser.requiresTwoFactorAuth] : currentUser.requiresTwoFactorAuth));
            main.alert("[VA] Plesae enter your 2FA token and click 'Verify 2FA'");
            fatype = currentUser.requiresTwoFactorAuth + "";
            
        } else{
            console.log(resp.data);
            main.log(`[VA] Logged in as: ${currentUser.displayName}`);
            //console.log(currentUser);
        
            user = currentUser.displayName;
        
            userid = currentUser.id;
            authData = currentUser;
        
            //updateCurrentWorld();
        }
    

    
    })
    .catch(err => { 
        //main.log("[VA] \u001b[31mERROR ERROR ERROR\u001b[0m");
        //main.log(`[VA] ERROR: Failed to log in. Please restart VRCPM and try again.`);
        main.error("V-001",err);
        main.error("V-001", `Failed to log in. Please ensure your login details are correct. Restart VRCPM and try again.`);
    }
    );

}



let currentWorld = "an unknown world";
let currentWorldId = "0000";

function updateCurrentWorld(){ this.updateCurrentWorld(); }

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
    
            })
            .catch(err => {
                main.error("V-003", err);
            });
        }

    })
    .catch(err => {
        main.error("V-002",err);
        main.error("V-002", "Failed to get current world. Please restart VRCPM and try again.")
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



function faSuccess(data){
    //console.log(data);
    if(data.data.verified){
        let auth = null;
        try{
            auth = data.config.jar.store.idx['api.vrchat.cloud']['/'].twoFactorAuth + "";
            console.log(auth);
            auth = auth.split("=")[1].split(";")[0];
            console.log(auth);
        } catch (error) {
            main.error("V-005", error)
        }

        console.log(auth);

        cfg.save2fa(auth);

        getTheUser();

        main.alert("[VA] 2FA Verification Successful. Please restart VRCPM to finish log in.")
    }else{
        main.alert("[VA] Failed to verify 2FA.")
    }
    
}

function faFail(data){
    main.error("V-004", data);
}

function setAuthCookie(authCookie) {
    main.log("[VA] Setting 2FA auth cookie.")
    const jar = (axios.defaults).jar
    jar.setCookie(
        new Cookie({ key: 'twoFactorAuth', value: authCookie }),
        'https://api.vrchat.cloud'
    )
    jar.setCookie(
        new Cookie({ key: 'apiKey', value: 'JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26' }),
        'https://api.vrchat.cloud'
    )
}

module.exports = {...this, currentWorld, currentWorldId, getCurrentWorld, getCurrentWorldId, getUser};