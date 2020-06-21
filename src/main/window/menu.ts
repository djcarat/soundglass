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

ipcMain.on('change-output-menu', (event, outputId: number, device: number) => {
    try {
        menu.getMenuItemById(`${outputId}-${device}`).click()
    } catch (err) {
        console.error(err)
    }
})

ipcMain.on('register-output-devices-1', (event, audioDevices: Array<string>) => {
    registerDevices(1, audioDevices)
})

ipcMain.on('register-output-devices-2', (event, audioDevices: Array<string>) => {
    registerDevices(2, audioDevices)
})

function registerDevices(id: number, audioDevices: Array<string>) {
    if (process.platform != "darwin") return;

    let newSubmenu = []

    for (const device of audioDevices) {
        newSubmenu.push({
            label: device,
            type: 'radio',
            id: `${id}-${audioDevices.indexOf(device)}`,
            click: () => {
                win.webContents.send(`change-output-device-${id}`, audioDevices.indexOf(device))
            }
        })
    }

    let menuItem = new MenuItem({
        label: `Output ${id}`,
        submenu: newSubmenu
    })

    menu.insert(2, menuItem)
    Menu.setApplicationMenu(menu)
}

//@ts-ignore
let menu = Menu.buildFromTemplate(template);