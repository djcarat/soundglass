import { BrowserWindow, app } from 'electron'
import * as glasstron from 'glasstron'
import { join } from 'path'
import { initPermissions } from '../permissions'

export let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        width: 1080,
        height: 620,
        minWidth: 200,
        minHeight: 200,
        title: 'Soundglass',
        show: false,
        webPreferences: {
            preload: join(__dirname, '../../renderer/scripts/renderer.js'),
            enableRemoteModule: false,
            contextIsolation: true,
            devTools: true,
        }
    })

    initPermissions()

    win.webContents.on('did-finish-load', () => win.show())
    win.webContents.on('will-navigate', (event) => event.preventDefault())
    win.webContents.on('new-window', (event) => event.preventDefault())

    win.loadFile(join(__dirname, '../../renderer/index.html'))

    glasstron.update(win, {
        windows: {blurType: 'arcylic'},
        macos: {vibrancy: 'fullscreen-ui'},
        linux: {requrestBlur: true}
    })
}

app.whenReady().then(createWindow);