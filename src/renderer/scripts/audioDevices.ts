import { ipcRenderer } from 'electron'
import { audio, mic, voice } from './renderer'

export function openSoundFileDialog() {
    ipcRenderer.send('open-sound-file-dialog')
}

export function loadAudioDevices() {
    let filteredOutputDevices = [];
    let filteredInputDevices = [];

    navigator.mediaDevices.enumerateDevices().then(devices => {
        filteredOutputDevices = devices.filter(device => device.kind === "audiooutput")
        filteredInputDevices = devices.filter(device => device.kind === "audioinput")

        let outputDevicesToSend: Array<string> = []
        let inputDevicesToSend: Array<string> = []

        for (const key of filteredOutputDevices) {
            outputDevicesToSend.push(key.label)
        }

        for (const key of filteredInputDevices) {
            inputDevicesToSend.push(key.label)
        }

        ipcRenderer.send('register-output-devices', outputDevicesToSend)
        ipcRenderer.send('register-input-devices', inputDevicesToSend)
    })
    
    ipcRenderer.on('change-output-device', (event, device: number) => {
        (audio as any).setSinkId(filteredOutputDevices[device].deviceId);
        (voice as any).setSinkId(filteredOutputDevices[device].deviceId);
    })
    
    ipcRenderer.on('change-input-device', (event, device: number) => {
        (mic as any).setSinkId(filteredOutputDevices[device].deviceId)
    })
}

export function setUpMic() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then((stream) => {
        mic.srcObject = stream;
        voice.srcObject = stream;
    }).catch(err => console.error(err))
}