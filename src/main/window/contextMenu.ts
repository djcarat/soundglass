import { app, Menu, ipcMain } from "electron";
import { openSoundFileDialog } from "../dialog";

app.whenReady().then(initContextMenu)

let tabMenu: Menu;
let blankMenu: Menu;

function initContextMenu() {
    let isMac = process.platform === "darwin"

    tabMenu = new Menu()

    const tabTemplate = [
        { label: 'Remove Sound' },
        { type: 'separator' },
        isMac ? { label: 'Reveal in Finder' } : { label: 'Show in Explorer' }
    ]

    //@ts-ignore
    tabMenu = Menu.buildFromTemplate(tabTemplate)

    blankMenu = new Menu()

    const blankTemplate = [
        { label: 'Import Sound', click: () => openSoundFileDialog() }
    ]

    blankMenu = Menu.buildFromTemplate(blankTemplate)
}

ipcMain.on('tab-menu-popup', () => {
    tabMenu.popup()
})

ipcMain.on('blank-menu-popup', () => {
    blankMenu.popup()
})