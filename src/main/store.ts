import { ipcMain } from "electron"
import { win } from "./window/window"

const Store = require('electron-store')

export const store = new Store()

function sendSettings() {
    if (store.has('settings')) {
        win.webContents.send('load-settings', store.get('settings'))
    }
}

ipcMain.on('save-tabs', (event, tabs: string) => {
    store.set('tabs', tabs)
})

ipcMain.on('get-tabs', (event) => {
    win.webContents.send('load-tabs', store.get('tabs'))
})

ipcMain.on('get-settings', sendSettings)

ipcMain.on('save-settings', (event, settings) => {
    store.set('settings', settings)
})