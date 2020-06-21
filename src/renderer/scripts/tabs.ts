import { ipcRenderer, shell } from 'electron'
import { audio, contextMenuTarget, audio2 } from './renderer'

ipcRenderer.on('create-tab', (event, filePath) => createNewTab(filePath))

ipcRenderer.on('show-tab-in-folder', () => {
    shell.showItemInFolder((contextMenuTarget.getElementsByClassName('title')[0] as HTMLElement).dataset.path.slice(7))
})

ipcRenderer.on('load-tabs', (event, tabs: string) => {
    if (tabs !== undefined) {
        document.getElementById('tabList').innerHTML = tabs;
        registerTabsEvents()
    }
})

ipcRenderer.on('remove-tab', () => {
    contextMenuTarget.classList.add('removed')
    setTimeout(() => {
        contextMenuTarget.remove()
        ipcRenderer.send('unregister-global-shortcut', (contextMenuTarget.getElementsByClassName('shortcut')[0] as HTMLElement).innerHTML)
        saveTabs()
        if ((contextMenuTarget.getElementsByClassName('title')[0] as HTMLElement).dataset.path === audio.src) {
            audio.pause()
            audio2.pause()
        }
    }, 400);
})

let isRegisteringShortcut: boolean = false
let registerShortcutEvent: Event

onkeypress = (key) => {
    if (isRegisteringShortcut) {
        isRegisteringShortcut = false
        registerShortcut(key)
    }
}

ipcRenderer.on('global-shortcut-called', (event, shortcut: string) => {
    if (shortcut.includes("numadd")) shortcut = shortcut.replace("numadd", "NUM+")
    else if (shortcut.includes("numsub")) shortcut = shortcut.replace("numsub", "NUM-")
    else if (shortcut.includes("numdec")) shortcut = shortcut.replace("numdec", "NUM.")
    else if (shortcut.includes("numult")) shortcut = shortcut.replace("numult", "NUM*")
    else if (shortcut.includes("numdiv")) shortcut = shortcut.replace("numdiv", "NUM/")

    let tabs = document.getElementsByClassName('tab');
    shortcut = shortcut.split("+").join(" ")

    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].getElementsByClassName('shortcut')[0].innerHTML === shortcut) {
            (tabs[i] as HTMLElement).click()
        }
    }
})

function saveTabs() {
    ipcRenderer.send('save-tabs', document.getElementById('tabList').innerHTML)
}

export function toggleSettings() {
    let settingsIcon = document.getElementById('settings').getElementsByClassName('arrow')[0]
    let settingsContent = document.getElementById('settingsContent')
    
    if (!settingsContent.classList.contains('active')) {
        settingsIcon.classList.add('up')
        settingsIcon.classList.remove('down')
    } else {
        settingsIcon.classList.remove('up')
        settingsIcon.classList.add('down')
    }
    settingsContent.classList.toggle('active')
}

function createNewTab(filePath: string) {
    let newTab = document.createElement('div')
    let tabList = document.getElementById('tabList')

    newTab.innerHTML = `
        <span class="title" data-path="${filePath}">${filePath.replace(/^.*[\\\/]/, '').split('.').shift()}</span>
        <span class="shortcut">NONE</span>
        <div class="progress"></div>`
        newTab.classList.add('tab')
        newTab.classList.add('tab-popup')
        newTab.onclick = () => tabClick(newTab);
        (newTab.getElementsByClassName('shortcut')[0] as HTMLElement).onclick = (event) => startRegisteringShortcut(event)
        tabList.appendChild(newTab)
        saveTabs()
}

function startRegisteringShortcut(event: Event) {
    event.stopPropagation();
    if (isRegisteringShortcut) return;
    ipcRenderer.send('unregister-global-shortcut', (event.target as HTMLElement).innerHTML);
    (event.target as HTMLElement).innerText = "Register shortcut.."
    isRegisteringShortcut = true
    registerShortcutEvent = event
}

function registerShortcut(key: KeyboardEvent, isLoading?: boolean) {
    let shortcut = "";
    if (key.ctrlKey) shortcut += "Ctrl "
    if (key.altKey) shortcut += "Alt "
    if (key.shiftKey) shortcut += "Shift "

    if (key.location === 3) {
        shortcut += "Num"
    }

    if (key.code === "Space") {
        shortcut += "Space"   
    }

    if (key.code === "NumpadEnter") return;

    shortcut += `${key.key}`
    shortcut = shortcut.toUpperCase();

    if (!isLoading)
    (registerShortcutEvent.target as HTMLElement).innerText = shortcut;

    let shortcutToSend = shortcut
    shortcutToSend = shortcutToSend.split(" ").join("+")

    ipcRenderer.send('register-global-shortcut', shortcutToSend)
    saveTabs()
}

function tabClick(el: HTMLElement) {
    if (el.classList.contains('active')) {
        el.classList.remove('active')
        audio.pause()
        audio2.pause()
    }
    else {
        disableAllActiveTabs()
        el.classList.toggle('active')
        audio.src = (el.getElementsByClassName('title')[0] as HTMLElement).dataset.path
        audio.currentTime = 0
        audio.load()
        audio.play().catch(exception => {
            console.error(exception)
            alert(`Couldn't load file "${audio.src}" :(
                Try to import this file again.`)
        })
        audio2.src = (el.getElementsByClassName('title')[0] as HTMLElement).dataset.path
        audio2.currentTime = 0
        audio2.load()
        audio2.play()
    }
}

export function setAudioListeners() {
    let active = document.getElementById('tabList').getElementsByClassName('active')
    setInterval(() => {
        if (active.length <= 0) return

        if (audio.paused) {
            setProgressLevel('0')
            disableAllActiveTabs()
        } else {
            setProgressLevel(`${(audio.currentTime / audio.duration) * 100}%`)
        }
    }, 1)
}

function registerTabsEvents() {
    for (let i = 0; i < document.getElementById('tabList').getElementsByClassName('tab').length; i++) {
        let element = document.getElementById('tabList').getElementsByClassName('tab')[i] as HTMLElement
        element.onclick = () => tabClick(element);
        (element.getElementsByClassName('shortcut')[0] as HTMLElement).onclick = (event) => startRegisteringShortcut(event)
        let key = new KeyboardEvent("keypress", {key: (element.getElementsByClassName('shortcut')[0] as HTMLElement).innerHTML})
        registerShortcut(key, true)
    }
}

export function disableAllActiveTabs() {
    for (let i = 0; i < document.getElementById('tabList').getElementsByClassName('tab').length; i++) {
        let element = document.getElementById('tabList').getElementsByClassName('tab')[i]
        element.classList.remove('active')
    }
}

export function setProgressLevel(progress: string) {
    let active = document.getElementById('tabList').getElementsByClassName('active');
    if (active.length > 0) {
        (active[0].getElementsByClassName('progress')[0] as HTMLElement).style.width = progress;
    }
}