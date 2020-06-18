import { loadAudioDevices, openSoundFileDialog, setUpMic  } from './audioDevices'
import { setAudioListeners  } from './tabs'
import { ipcRenderer } from 'electron'

export let audio: HTMLAudioElement
export let voice: HTMLAudioElement
export let mic: HTMLAudioElement

onload = () => {
    audio = document.getElementById('sound') as HTMLAudioElement
    voice = document.getElementById('voice') as HTMLAudioElement
    mic = document.getElementById('mic') as HTMLAudioElement
    document.getElementById('newTab').onclick = () => openSoundFileDialog()
    loadAudioDevices()
    setAudioListeners()
    setUpMic()
    addEventListener('contextmenu', (event) => {
        let target = event.target as HTMLElement;

        if (target.classList.contains("tab") && target.id != "newTab") 
            ipcRenderer.send('tab-menu-popup')
        else if (target === document.body || target.id === "tabList" || target.id === "newTab") {
            ipcRenderer.send('blank-menu-popup')
        }
    })
}