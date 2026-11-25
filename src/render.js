const { ipcRenderer } = require('electron');

var term = new Terminal({convertEol: true});
term.open(document.getElementById('terminal'));
//term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
localLog("Loading VRCPM...");


ipcRenderer.on("console-log", (event, arg) => {
    console.log(arg);
    term.writeln(arg);
});

ipcRenderer.on("update-available", (event, update) => {
    document.getElementById("updateText").textContent = update.message + " ";
    // Only Linux/other platforms need a manual download link.
    if(!update.autoUpdates && update.url.startsWith("https://github.com/Yernemm/")){
        let link = document.getElementById("updateLink");
        link.style.display = "inline";
        link.onclick = (e) => {
            e.preventDefault();
            require('electron').shell.openExternal(update.url);
        };
    }
    document.getElementById("updateBanner").style.display = "block";
});

function localLog(message){
    term.writeln("[RENDERER] " + message);
}

function saveButton(){
    localLog("Save button pressed.");
    ipcRenderer.send("save-button", {
        webhook: document.getElementById("webhook").value,
        photopath: document.getElementById("photopath").value
    });
}

function openConfig(){
    localLog("Open config button pressed.");
    ipcRenderer.send("open-config");
}

document.getElementById("appVersion").textContent = require('../package.json').version;

ipcRenderer.send("ready");

function hideAll(){

    ["terminalBlock", "settingsBlock"].forEach(block => {
      x = document.getElementById(block);
      x.style.display = "none";
    });

    
    ["tabLogs", "tabSettings"].forEach(block => {
        x = document.getElementById(block);
        x.className = "tab";
      });

}
  
  
  function clickLogs(){
    hideAll()
    var x = document.getElementById("terminalBlock");
      x.style.display = "block";

  }
  
  function clickSettings(){
    hideAll()
    var x = document.getElementById("settingsBlock");
    x.style.display = "block";

  }

function selectTab(tabId, blockId)
{
    let tab = document.getElementById(tabId);
    let block = document.getElementById(blockId);

    hideAll();

    tab.className = "tab tab-selected";

    block.style.display = "block";


}
