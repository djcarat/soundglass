"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const window_1 = require("./window");
const dialog_1 = require("../dialog");
const template = [
    {
        label: electron_1.app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ]
    },
    {
        label: 'File',
        submenu: [
            { label: 'Import Sound', click: () => dialog_1.openSoundFileDialog() },
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' }
        ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' },
        ]
    },
    {
        role: 'help',
        submenu: [
            { label: 'Report an issue' },
            { role: 'reload' },
            { role: 'toggledevtools' }
        ]
    },
];
electron_1.ipcMain.on('change-output-menu', (event, outputId, device) => {
    try {
        menu.getMenuItemById(`${outputId}-${device}`).click();
    }
    catch (err) {
        console.error(err);
    }
});
electron_1.ipcMain.on('register-output-devices-1', (event, audioDevices) => {
    registerDevices(1, audioDevices);
});
electron_1.ipcMain.on('register-output-devices-2', (event, audioDevices) => {
    registerDevices(2, audioDevices);
});
function registerDevices(id, audioDevices) {
    if (process.platform != "darwin")
        return;
    let newSubmenu = [];
    for (const device of audioDevices) {
        newSubmenu.push({
            label: device,
            type: 'radio',
            id: `${id}-${audioDevices.indexOf(device)}`,
            click: () => {
                window_1.win.webContents.send(`change-output-device-${id}`, audioDevices.indexOf(device));
            }
        });
    }
    let menuItem = new electron_1.MenuItem({
        label: `Output ${id}`,
        submenu: newSubmenu
    });
    menu.insert(2, menuItem);
    electron_1.Menu.setApplicationMenu(menu);
}
//@ts-ignore
let menu = electron_1.Menu.buildFromTemplate(template);
