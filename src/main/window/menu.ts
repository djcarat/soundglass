import { app, Menu, ipcMain, MenuItem } from "electron";
import { win } from './window'
import { openSoundFileDialog } from "../dialog";

const isMac = process.platform === "darwin"

const template = [
    isMac ? {
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
    } : {},
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
]


ipcMain.on('register-output-devices', (event, audioDevices: Array<string>) => {
    let menuItem = registerDevices('output', audioDevices)

    isMac ? menu.insert(2, menuItem) : menu.insert(1, menuItem)
    Menu.setApplicationMenu(menu)
})

ipcMain.on('register-input-devices', (event, audioDevices: Array<string>) => {
    let menuItem = registerDevices('input', audioDevices)

    isMac ? menu.insert(3, menuItem) : menu.insert(2, menuItem)
    Menu.setApplicationMenu(menu)
})

function registerDevices(type: string, audioDevices: Array<string>) {
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

    return menuItem;
}

//@ts-ignore
let menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);