import { loadAudioDevices, openSoundFileDialog, setUpMic, saveSettings  } from './audioDevices'
import { setAudioListeners, toggleSettings  } from './tabs'
import { OpenURL } from './credits'
import { ipcRenderer } from 'electron'
import { initTopbar } from './topbar'

export let audio: HTMLAudioElement
export let voice: HTMLAudioElement
export let audio2: HTMLAudioElement
export let voice2: HTMLAudioElement
export let mic: HTMLAudioElement
export let contextMenuTarget: HTMLElement

onload = () => {
    audio = document.getElementById('sound') as HTMLAudioElement
    voice = document.getElementById('voice') as HTMLAudioElement
    mic = document.getElementById('mic') as HTMLAudioElement
    audio2 = document.getElementById('sound-2') as HTMLAudioElement
    voice2 = document.getElementById('voice-2') as HTMLAudioElement
    document.getElementById('newTab').onclick = () => openSoundFileDialog()
    document.getElementById('settings').onclick = () => toggleSettings()
    document.getElementById('source').onclick = () => OpenURL("https://github.com/pixldev/soundglass")
    document.getElementById('mute').onchange = () => {
        if ((document.getElementById('mute') as HTMLInputElement).checked) {
            voice.muted = true
            voice2.muted = true
        } else {
            voice.muted = false
            voice2.muted = false
        }
        saveSettings()
    }
    if (navigator.appVersion.indexOf("Win") != -1) {
        document.body.classList.add('windows')
    }
    initTopbar()
    loadAudioDevices()
    setAudioListeners()
    setUpMic()
    addEventListener('contextmenu', (event) => {
        let target = event.target as HTMLElement;
        contextMenuTarget = target
        
        if (target.classList.contains("tab-popup")) 
            ipcRenderer.send('tab-menu-popup')
        else if (target.classList.contains("blank-popup")) {
            ipcRenderer.send('blank-menu-popup')
        }
    })
    ipcRenderer.send('get-settings')
    ipcRenderer.send('get-tabs')
}