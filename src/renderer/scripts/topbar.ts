import { ipcRenderer } from "electron"

let close: HTMLElement
let resize: HTMLElement
let minimize: HTMLElement

export function initTopbar() {
    if (process.platform != "win32") return
    document.getElementById('topbar').classList.add('active')

    close = document.getElementById('close')
    resize = document.getElementById('resize')
    minimize = document.getElementById('minimize')

    close.onclick = () => ipcRenderer.send('close')
    resize.onclick = () => ipcRenderer.send('resize')
    minimize.onclick = () => ipcRenderer.send('minimize')
}

ipcRenderer.on('win-state-change', (event, isMaximized: boolean) => {
    if (isMaximized) {
        resize.innerHTML = '&#xE923;'
    } else {
        resize.innerHTML = '&#xE922;'
    }
})