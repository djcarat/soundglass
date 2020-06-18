"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const window_1 = require("./window/window");
electron_1.ipcMain.on('register-global-shortcut', (event, shortcut) => {
    console.log(shortcut);
    electron_1.globalShortcut.register(shortcut, () => {
        window_1.win.webContents.send('global-shortcut-called', shortcut);
    });
});
