import { ipcRenderer } from 'electron'
import { audio } from './renderer'

ipcRenderer.on('create-tab', (event, filePath) => createNewTab(filePath))

let isRegisteringShortcut: boolean = false
let registerShortcutEvent: Event

onkeypress = (key) => {
    if (isRegisteringShortcut) {
        isRegisteringShortcut = false
        registerShortcut(key)
    }
}

ipcRenderer.on('global-shortcut-called', (event, shortcut: string) => {
    let tabs = document.getElementsByClassName('tab');
    shortcut = shortcut.split("+").join(" ")

    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].getElementsByClassName('shortcut')[0].innerHTML === shortcut) {
            (tabs[i] as HTMLElement).click()
        }
    }
})

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
}

function startRegisteringShortcut(event: Event) {
    event.stopPropagation();
    if (isRegisteringShortcut) return;
    (event.target as HTMLElement).innerText = "Register shortcut.."
    isRegisteringShortcut = true
    registerShortcutEvent = event
}

function registerShortcut(key: KeyboardEvent) {
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

    shortcut += `${key.key}`
    shortcut = shortcut.toUpperCase();

    (registerShortcutEvent.target as HTMLElement).innerText = shortcut;

    let shortcutToSend = shortcut;
    shortcutToSend = shortcutToSend.split(" ").join("+")

    ipcRenderer.send('register-global-shortcut', shortcutToSend)
}

function tabClick(el: HTMLElement) {
    if (el.classList.contains('active')) {
        el.classList.remove('active')
        audio.pause()
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
    }
}

export function setAudioListeners() {
    setInterval(() => {
        if (document.getElementsByClassName('active').length < 0) return

        if (audio.paused) {
            setProgressLevel('0')
            disableAllActiveTabs()
        } else {
            setProgressLevel(`${(audio.currentTime / audio.duration) * 100}%`)
        }
    }, 1)
}

export function disableAllActiveTabs() {
    for (let i = 0; i < document.getElementsByClassName('tab').length; i++) {
        let element = document.getElementsByClassName('tab')[i]

        element.classList.remove('active')
    }
}

export function setProgressLevel(progress: string) {
    if (document.getElementById('tabList').getElementsByClassName('active').length > 0)
    (document.getElementsByClassName('active')[0].getElementsByClassName('progress')[0] as HTMLElement).style.width = progress;
}