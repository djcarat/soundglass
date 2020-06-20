import { loadAudioDevices, openSoundFileDialog, setUpMic  } from './audioDevices'
import { setAudioListeners, toggleSettings  } from './tabs'
import { ipcRenderer } from 'electron'

export let audio: HTMLAudioElement
export let voice: HTMLAudioElement
export let mic: HTMLAudioElement

onload = () => {
    audio = document.getElementById('sound') as HTMLAudioElement
    voice = document.getElementById('voice') as HTMLAudioElement
    mic = document.getElementById('mic') as HTMLAudioElement
    document.getElementById('newTab').onclick = () => openSoundFileDialog()
    document.getElementById('settings').onclick = () => toggleSettings()
    loadAudioDevices()
    setAudioListeners()
    setUpMic()
    addEventListener('contextmenu', (event) => {
        let target = event.target as HTMLElement;

        if (target.classList.contains("tab-popup")) 
            ipcRenderer.send('tab-menu-popup')
        else if (target.classList.contains("blank-popup")) {
            ipcRenderer.send('blank-menu-popup')
        }
    })
}