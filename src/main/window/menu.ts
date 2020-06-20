import { app, Menu, ipcMain, MenuItem } from "electron";
import { win } from './window'
import { openSoundFileDialog } from "../dialog";

const template = [
    {
        label: app.name,
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
            { label: 'Import Sound', click: () => openSoundFileDialog() },
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
]


ipcMain.on('register-output-devices', (event, audioDevices: Array<string>) => {
    registerDevices('output', audioDevices)
})

ipcMain.on('register-input-devices', (event, audioDevices: Array<string>) => {
    registerDevices('input', audioDevices)
})

function registerDevices(type: string, audioDevices: Array<string>) {
    if (process.platform != "darwin") return;

    let newSubmenu = []

    if (type === "input") {
        newSubmenu.push({
            label: 'Mute Microphone',
            type: 'checkbox',
        })

        newSubmenu.push({type: 'separator'})
    }

    for (const device of audioDevices) {
        newSubmenu.push({
            label: device,
            type: 'radio',
            click: () => {
                win.webContents.send(`change-${type}-device`, audioDevices.indexOf(device))
            }
        })
    }

    let menuItem = new MenuItem({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        submenu: newSubmenu
    })

    menu.insert(2, menuItem)
    Menu.setApplicationMenu(menu)
}

//@ts-ignore
let menu = Menu.buildFromTemplate(template);