import { ipcMain, dialog } from "electron";
import { win } from "./window/window";

ipcMain.on('open-sound-file-dialog', (event) => {
    openSoundFileDialog()
})

export function openSoundFileDialog() {
    dialog.showOpenDialog(win, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Sound Files', extensions: ['mp3', 'wav', 'ogg'] }
        ]
    }).then(result => {
        if (!result.canceled) {
            for (let i = 0; i < result.filePaths.length; i++) {
                win.webContents.send('create-tab', 'file://' + result.filePaths[i])
            }
        }
    }).catch(err => {
        console.log(err)
    })
}