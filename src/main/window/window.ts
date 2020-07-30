import { store } from '../store'
import { BrowserWindow, app, ipcMain, nativeImage } from 'electron'
import { join } from 'path'
import { initPermissions } from '../permissions'

export let win: BrowserWindow | null

let isWin = process.platform === "win32"

function createWindow() {
    win = new BrowserWindow({
        width: 980,
        height: 680,
        minWidth: 200,
        minHeight: 200,
        title: 'Soundglass',
        show: false,
        icon: nativeImage.createFromPath(join(__dirname, '../../assets/icon.png')),
        frame: isWin ? false : true,
        webPreferences: {
            preload: join(__dirname, '../../renderer/scripts/renderer.js'),
            enableRemoteModule: false,
            contextIsolation: true,
            devTools: false,
        }
    })
    
    if (process.platform === "darwin")
    app.dock.setIcon(nativeImage.createFromPath(join(__dirname, '../../assets/icon.png')))

    initPermissions()

    if (store.has('win-bounds')) {
        win.setBounds(store.get('win-bounds'))
    } else {
        store.set('win-bounds', win.getBounds())
    }

    win.webContents.on('did-finish-load', () => win.show());
    win.webContents.on('will-navigate', (event) => event.preventDefault())
    win.webContents.on('new-window', (event) => event.preventDefault())
    
    win.on('maximize', () => win.webContents.send('win-state-change', true))
    win.on('unmaximize', () => win.webContents.send('win-state-change', false))

    win.loadFile(join(__dirname, '../../renderer/index.html'))

    if (process.platform != "darwin") {
        win.setThumbarButtons([
            {
                tooltip: 'Toggle Transparency',
                icon: nativeImage.createFromPath(join(__dirname, '../../assets/icon.png')),
                click: () => toggleTransparency(),
            }
        ])
    }
}

export function toggleTransparency() {
    if (store.get("transparency"))
        store.set("transparency", false)
    else
        store.set("transparency", true)

    app.quit();
}

ipcMain.on('close', () => {
    app.quit()
})

ipcMain.on('resize', () => {
    if (win.isMaximized()) {
        win.unmaximize()
    }
    else {
        win.maximize()
    }
})

ipcMain.on('minimize', () => {
    win.minimize()
})

app.on('quit', () => {
    store.set('win-bounds', win.getBounds())
})

app.whenReady().then(createWindow);