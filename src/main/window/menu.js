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
            { type: 'separator' },
            { label: 'Save Config' },
            { label: 'Save Config As..' },
            { type: 'separator' },
            { label: 'Load Config' },
            { type: 'separator' },
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
electron_1.ipcMain.on('register-output-devices', (event, audioDevices) => {
    registerDevices('output', audioDevices);
});
electron_1.ipcMain.on('register-input-devices', (event, audioDevices) => {
    registerDevices('input', audioDevices);
});
function registerDevices(type, audioDevices) {
    if (process.platform != "darwin")
        return;
    let newSubmenu = [];
    if (type === "input") {
        newSubmenu.push({
            label: 'Mute Microphone',
            type: 'checkbox',
        });
        newSubmenu.push({ type: 'separator' });
    }
    for (const device of audioDevices) {
        newSubmenu.push({
            label: device,
            type: 'radio',
            click: () => {
                window_1.win.webContents.send(`change-${type}-device`, audioDevices.indexOf(device));
            }
        });
    }
    let menuItem = new electron_1.MenuItem({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        submenu: newSubmenu
    });
    menu.insert(2, menuItem);
    electron_1.Menu.setApplicationMenu(menu);
}
//@ts-ignore
let menu = electron_1.Menu.buildFromTemplate(template);
