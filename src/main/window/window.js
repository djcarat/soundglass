"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.win = void 0;
const glasstron = require("glasstron");
if (process.platform != "darwin")
    glasstron.init();
const electron_1 = require("electron");
const path_1 = require("path");
const permissions_1 = require("../permissions");
const store_1 = require("../store");
let isWin = process.platform === "win32";
function createWindow() {
    exports.win = new electron_1.BrowserWindow({
        width: 980,
        height: 680,
        minWidth: 200,
        minHeight: 200,
        title: 'Soundglass',
        show: false,
        frame: isWin ? false : true,
        webPreferences: {
            preload: path_1.join(__dirname, '../../renderer/scripts/renderer.js'),
            enableRemoteModule: false,
            contextIsolation: true,
            devTools: true,
        }
    });
    permissions_1.initPermissions();
    if (store_1.store.has('win-bounds')) {
        exports.win.setBounds(store_1.store.get('win-bounds'));
    }
    else {
        store_1.store.set('win-bounds', exports.win.getBounds());
    }
    exports.win.webContents.on('did-finish-load', () => exports.win.show());
    exports.win.webContents.on('will-navigate', (event) => event.preventDefault());
    exports.win.webContents.on('new-window', (event) => event.preventDefault());
    exports.win.on('maximize', () => exports.win.webContents.send('win-state-change', true));
    exports.win.on('unmaximize', () => exports.win.webContents.send('win-state-change', false));
    exports.win.loadFile(path_1.join(__dirname, '../../renderer/index.html'));
    glasstron.update(exports.win, {
        windows: { blurType: 'blurbehind' },
        macos: { vibrancy: 'fullscreen-ui' },
        linux: { requrestBlur: true }
    });
}
electron_1.ipcMain.on('close', () => {
    electron_1.app.quit();
});
electron_1.ipcMain.on('resize', () => {
    if (exports.win.isMaximized()) {
        exports.win.unmaximize();
    }
    else {
        exports.win.maximize();
    }
});
electron_1.ipcMain.on('minimize', () => {
    exports.win.minimize();
});
electron_1.app.on('quit', () => {
    store_1.store.set('win-bounds', exports.win.getBounds());
});
electron_1.app.whenReady().then(createWindow);
