"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.win = void 0;
const electron_1 = require("electron");
const glasstron = require("glasstron");
const path_1 = require("path");
const permissions_1 = require("../permissions");
function createWindow() {
    exports.win = new electron_1.BrowserWindow({
        width: 1080,
        height: 620,
        minWidth: 200,
        minHeight: 200,
        title: 'Soundglass',
        show: false,
        webPreferences: {
            preload: path_1.join(__dirname, '../../renderer/scripts/renderer.js'),
            enableRemoteModule: false,
            contextIsolation: true,
            devTools: true,
        }
    });
    permissions_1.initPermissions();
    exports.win.webContents.on('did-finish-load', () => exports.win.show());
    exports.win.webContents.on('will-navigate', (event) => event.preventDefault());
    exports.win.webContents.on('new-window', (event) => event.preventDefault());
    exports.win.loadFile(path_1.join(__dirname, '../../renderer/index.html'));
    glasstron.update(exports.win, {
        windows: { blurType: 'arcylic' },
        macos: { vibrancy: 'fullscreen-ui' },
        linux: { requrestBlur: true }
    });
}
electron_1.app.whenReady().then(createWindow);
