import { ipcRenderer } from 'electron'
import { audio, mic, voice, audio2, voice2 } from './renderer'

export function openSoundFileDialog() {
    ipcRenderer.send('open-sound-file-dialog')
}

let outputSelect1: HTMLSelectElement
let outputSelect2: HTMLSelectElement
let outputRange1: HTMLInputElement
let outputRange2: HTMLInputElement

let newOutputSelect1Index: number
let newOutputSelect2Index: number
let storeLoaded = false

export function loadAudioDevices() {
    let filteredOutputDevices = [];
    outputSelect1 = document.getElementById('output-select-1') as HTMLSelectElement
    outputSelect2 = document.getElementById('output-select-2') as HTMLSelectElement
    outputRange1 = document.getElementById('output-range-1') as HTMLInputElement
    outputRange2 = document.getElementById('output-range-2') as HTMLInputElement

    navigator.mediaDevices.enumerateDevices().then(devices => {
        filteredOutputDevices = devices.filter(device => device.kind === "audiooutput")

        outputSelect1.addEventListener('change', (event) => {
            changeOutputDevice1(outputSelect1.selectedIndex, filteredOutputDevices, false)
            saveSettings()
        })
        
        outputSelect2.addEventListener('change', (event) => {
            changeOutputDevice2(outputSelect2.selectedIndex, filteredOutputDevices, false)
            saveSettings()
        })

        outputRange1.addEventListener('input', (event) => {
            let newValue = +outputRange1.value / 100
            audio.volume = newValue
            voice.volume = newValue
            saveSettings()
        })
        
        outputRange2.addEventListener('input', (event) => {
            let newValue = +outputRange2.value / 100
            audio2.volume = newValue
            voice2.volume = newValue
            saveSettings()
        })

        let outputDevicesToSend: Array<string> = []

        for (const key of filteredOutputDevices) {
            outputDevicesToSend.push(key.label)
        }

        for (const key of filteredOutputDevices) {
            let el1 = document.createElement("option")
            el1.innerHTML = key.label;
            outputSelect1.appendChild(el1)
            let el2 = document.createElement("option")
            el2.innerHTML = key.label;
            outputSelect2.appendChild(el2)
        }

        if (storeLoaded) {
            outputSelect1.selectedIndex = newOutputSelect1Index
            outputSelect2.selectedIndex = newOutputSelect2Index
            changeOutputDevice1(outputSelect1.selectedIndex, filteredOutputDevices, true)
            changeOutputDevice2(outputSelect2.selectedIndex, filteredOutputDevices, true)
        }

        ipcRenderer.send('register-output-devices-2', outputDevicesToSend)
        ipcRenderer.send('register-output-devices-1', outputDevicesToSend)
    })
    
    ipcRenderer.on('change-output-device-1', (event, device: number) => {
        changeOutputDevice1(device, filteredOutputDevices, true)
    })

    ipcRenderer.on('change-output-device-2', (event, device: number) => {
        changeOutputDevice2(device, filteredOutputDevices, true)
    })
}

function changeOutputDevice1(device: number, filteredOutputDevices: Array<any>, fromRenderer: boolean) {
    (audio as any).setSinkId(filteredOutputDevices[device].deviceId);
    (voice as any).setSinkId(filteredOutputDevices[device].deviceId);
    if (fromRenderer) {
        outputSelect1.selectedIndex = device
    } else {
        ipcRenderer.send('change-output-menu', 1, device)
    }
    saveSettings()
}

function changeOutputDevice2(device: number, filteredOutputDevices: Array<any>, fromRenderer: boolean) {
    (audio2 as any).setSinkId(filteredOutputDevices[device].deviceId);
    (voice2 as any).setSinkId(filteredOutputDevices[device].deviceId);
    if (fromRenderer) {
        outputSelect2.selectedIndex = device
    } else {
        ipcRenderer.send('change-output-menu', 2, device)
    }
    saveSettings()
}

export function saveSettings() {
    ipcRenderer.send('save-settings', {
        outputSelect1: outputSelect1.selectedIndex,
        outputSelect2: outputSelect2.selectedIndex,
        outputRange1: outputRange1.value,
        outputRange2: outputRange2.value,
        mute: voice.muted
    })
}

export function setUpMic() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then((stream) => {
        mic.srcObject = stream;
        voice.srcObject = stream;
        voice2.srcObject = stream;
    }).catch(err => console.error(err))
}

ipcRenderer.on('load-settings', (event, settings) => {
    storeLoaded = true
    newOutputSelect1Index = settings.outputSelect1
    newOutputSelect2Index = settings.outputSelect2
    outputRange1.value = settings.outputRange1
    outputRange2.value = settings.outputRange2

    audio.volume = settings.outputRange1 / 100
    voice.volume = settings.outputRange1 / 100
    audio2.volume = settings.outputRange2 / 100
    voice2.volume = settings.outputRange2 / 100
    
    if (settings.mute)
        document.getElementById('mute').click()
})