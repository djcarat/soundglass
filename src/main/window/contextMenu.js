"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const dialog_1 = require("../dialog");
electron_1.app.whenReady().then(initContextMenu);
let tabMenu;
let blankMenu;
function initContextMenu() {
    let isMac = process.platform === "darwin";
    tabMenu = new electron_1.Menu();
    const tabTemplate = [
        { label: 'Remove Sound' },
        { type: 'separator' },
        isMac ? { label: 'Reveal in Finder' } : { label: 'Show in Explorer' }
    ];
    //@ts-ignore
    tabMenu = electron_1.Menu.buildFromTemplate(tabTemplate);
    blankMenu = new electron_1.Menu();
    const blankTemplate = [
        { label: 'Import Sound', click: () => dialog_1.openSoundFileDialog() }
    ];
    blankMenu = electron_1.Menu.buildFromTemplate(blankTemplate);
}
electron_1.ipcMain.on('tab-menu-popup', () => {
    tabMenu.popup();
});
electron_1.ipcMain.on('blank-menu-popup', () => {
    blankMenu.popup();
});
