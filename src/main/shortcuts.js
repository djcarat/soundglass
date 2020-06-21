"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const window_1 = require("./window/window");
function replaceNum(str, originalNum, newNum) {
    return str.replace(originalNum, newNum);
}
electron_1.ipcMain.on('register-global-shortcut', (event, shortcut) => {
    console.log(shortcut);
    if (shortcut.includes("NUM+"))
        shortcut = shortcut.replace("NUM+", "numadd");
    else if (shortcut.includes("NUM-"))
        shortcut = shortcut.replace("NUM-", "numsub");
    else if (shortcut.includes("NUM."))
        shortcut = shortcut.replace("NUM.", "numdec");
    else if (shortcut.includes("NUM*"))
        shortcut = shortcut.replace("NUM*", "numult");
    else if (shortcut.includes("NUM/"))
        shortcut = shortcut.replace("NUM/", "numdiv");
    console.log("CHANGED: " + shortcut);
    try {
        electron_1.globalShortcut.register(shortcut, () => {
            window_1.win.webContents.send('global-shortcut-called', shortcut);
        });
    }
    catch (err) {
        console.error(err);
    }
});
