import { globalShortcut, ipcMain, app } from 'electron'
import { win } from './window/window'

ipcMain.on('register-global-shortcut', (event, shortcut: string) => {
    console.log(shortcut)
    
    globalShortcut.register(shortcut, () => {
        win.webContents.send('global-shortcut-called', shortcut)
    })
})