"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openSoundFileDialog = void 0;
const electron_1 = require("electron");
const window_1 = require("./window/window");
electron_1.ipcMain.on('open-sound-file-dialog', (event) => {
    openSoundFileDialog();
});
function openSoundFileDialog() {
    electron_1.dialog.showOpenDialog(window_1.win, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Sound Files', extensions: ['mp3', 'wav', 'ogg'] }
        ]
    }).then(result => {
        if (!result.canceled) {
            for (let i = 0; i < result.filePaths.length; i++) {
                window_1.win.webContents.send('create-tab', 'file://' + result.filePaths[i]);
            }
        }
    }).catch(err => {
        console.log(err);
    });
}
exports.openSoundFileDialog = openSoundFileDialog;
