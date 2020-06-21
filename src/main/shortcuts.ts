import { globalShortcut, ipcMain, app } from 'electron'
import { win } from './window/window'

ipcMain.on('unregister-global-shortcut', (event, shortcut: string) => {
    try {
        if (!shortcut.includes("NONE"))
        globalShortcut.unregister(shortcut)
    } catch (err) {
        console.error(err)
    }
})

ipcMain.on('register-global-shortcut', (event, shortcut: string) => {

    if (shortcut.includes("NONE")) return

    if (shortcut.includes("NUM+")) shortcut = shortcut.replace("NUM+", "numadd")
    else if (shortcut.includes("NUM-")) shortcut = shortcut.replace("NUM-", "numsub")
    else if (shortcut.includes("NUM.")) shortcut = shortcut.replace("NUM.", "numdec")
    else if (shortcut.includes("NUM*")) shortcut = shortcut.replace("NUM*", "numult")
    else if (shortcut.includes("NUM/")) shortcut = shortcut.replace("NUM/", "numdiv")

    try {
        globalShortcut.register(shortcut, () => {
            win.webContents.send('global-shortcut-called', shortcut)
        })
    } catch (err) {
        console.error(err)
    }
})