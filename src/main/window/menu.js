"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const window_1 = require("./window");
const dialog_1 = require("../dialog");
const isMac = process.platform === "darwin";
const template = [
    isMac ? {
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
    } : {},
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
            isMac ? { role: 'close' } : { role: 'quit' },
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
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'help',
        submenu: [
            { label: 'Report an issue' },
            { role: 'reload' },
            isMac ? { role: 'toggledevtools' } : { role: 'about' },
        ]
    },
];
electron_1.ipcMain.on('register-output-devices', (event, audioDevices) => {
    let menuItem = registerDevices('output', audioDevices);
    isMac ? menu.insert(2, menuItem) : menu.insert(1, menuItem);
    electron_1.Menu.setApplicationMenu(menu);
});
electron_1.ipcMain.on('register-input-devices', (event, audioDevices) => {
    let menuItem = registerDevices('input', audioDevices);
    isMac ? menu.insert(3, menuItem) : menu.insert(2, menuItem);
    electron_1.Menu.setApplicationMenu(menu);
});
function registerDevices(type, audioDevices) {
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
    return menuItem;
}
//@ts-ignore
let menu = electron_1.Menu.buildFromTemplate(template);
electron_1.Menu.setApplicationMenu(menu);
