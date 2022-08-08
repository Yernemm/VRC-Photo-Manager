const { ipcRenderer } = require('electron');

var term = new Terminal();
term.open(document.getElementById('terminal'));
//term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
term.writeln("Loading VRCPM...");


ipcRenderer.on("console-log", (event, arg) => {
    console.log(arg);
    term.writeln(arg);
});

ipcRenderer.send("ready");
