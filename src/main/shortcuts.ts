import { globalShortcut, ipcMain, app } from 'electron'
import { win } from './window/window'

function replaceNum(str: string, originalNum: string, newNum: string) {
    return str.replace(originalNum, newNum)
}

ipcMain.on('register-global-shortcut', (event, shortcut: string) => {
    console.log(shortcut)

    if (shortcut.includes("NUM+")) shortcut = shortcut.replace("NUM+", "numadd")
    else if (shortcut.includes("NUM-")) shortcut = shortcut.replace("NUM-", "numsub")
    else if (shortcut.includes("NUM.")) shortcut = shortcut.replace("NUM.", "numdec")
    else if (shortcut.includes("NUM*")) shortcut = shortcut.replace("NUM*", "numult")
    else if (shortcut.includes("NUM/")) shortcut = shortcut.replace("NUM/", "numdiv")

    console.log("CHANGED: " + shortcut)
    try {
        globalShortcut.register(shortcut, () => {
            win.webContents.send('global-shortcut-called', shortcut)
        })
    } catch (err) {
        console.error(err)
    }
})