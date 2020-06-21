import { app, Menu, ipcMain } from "electron";
import { openSoundFileDialog } from "../dialog";
import { win } from "./window";

app.whenReady().then(initContextMenu)

let tabMenu: Menu;
let blankMenu: Menu;

function initContextMenu() {
    let isMac = process.platform === "darwin"

    tabMenu = new Menu()

    const tabTemplate = [
        { 
            label: 'Remove Sound',
            click: () => win.webContents.send('remove-tab')
        },
        { type: 'separator' },
        isMac ? { 
            label: 'Reveal in Finder',
            click: () => win.webContents.send('show-tab-in-folder')
        } : { label: 'Show in Explorer' }
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