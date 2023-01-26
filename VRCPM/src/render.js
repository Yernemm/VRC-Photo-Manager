const { ipcRenderer } = require('electron');

var term = new Terminal({convertEol: true});
term.open(document.getElementById('terminal'));
//term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
localLog("Loading VRCPM...");


ipcRenderer.on("console-log", (event, arg) => {
    console.log(arg);
    term.writeln(arg);
});

function localLog(message){
    term.writeln("[RENDERER] " + message);
}

function loginButton(){
    localLog("Login button pressed.");
    ipcRenderer.send("login-button", {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        webhook: document.getElementById("webhook").value
    });

}

function saveButton(){
    localLog("Save button pressed.");
    ipcRenderer.send("save-button", {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        webhook: document.getElementById("webhook").value
    });
}

function openConfig(){
    localLog("Open config button pressed.");
    ipcRenderer.send("open-config");
}

function verify2fa(){
    localLog("Verify 2FA button pressed.");
    ipcRenderer.send("verify2fa", document.getElementById("token").value);
}

ipcRenderer.send("ready");
