"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpMic = exports.loadAudioDevices = exports.openSoundFileDialog = void 0;
const electron_1 = require("electron");
const renderer_1 = require("./renderer");
function openSoundFileDialog() {
    electron_1.ipcRenderer.send('open-sound-file-dialog');
}
exports.openSoundFileDialog = openSoundFileDialog;
function loadAudioDevices() {
    let filteredOutputDevices = [];
    let filteredInputDevices = [];
    navigator.mediaDevices.enumerateDevices().then(devices => {
        filteredOutputDevices = devices.filter(device => device.kind === "audiooutput");
        filteredInputDevices = devices.filter(device => device.kind === "audioinput");
        let outputDevicesToSend = [];
        let inputDevicesToSend = [];
        for (const key of filteredOutputDevices) {
            outputDevicesToSend.push(key.label);
        }
        for (const key of filteredInputDevices) {
            inputDevicesToSend.push(key.label);
        }
        electron_1.ipcRenderer.send('register-output-devices', outputDevicesToSend);
        electron_1.ipcRenderer.send('register-input-devices', inputDevicesToSend);
    });
    electron_1.ipcRenderer.on('change-output-device', (event, device) => {
        renderer_1.audio.setSinkId(filteredOutputDevices[device].deviceId);
        renderer_1.voice.setSinkId(filteredOutputDevices[device].deviceId);
    });
    electron_1.ipcRenderer.on('change-input-device', (event, device) => {
        console.log(filteredInputDevices[device]);
        renderer_1.mic.setSinkId(filteredInputDevices[device].deviceId).then(() => {
            console.log('success (mic)');
            setUpMic();
        });
    });
}
exports.loadAudioDevices = loadAudioDevices;
let micAudioTrack = null;
function setUpMic() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
        renderer_1.mic.srcObject = stream;
        micAudioTrack = renderer_1.mic.srcObject.getAudioTracks()[0];
        renderer_1.voice.srcObject = stream;
    }).catch(err => console.error(err));
}
exports.setUpMic = setUpMic;
