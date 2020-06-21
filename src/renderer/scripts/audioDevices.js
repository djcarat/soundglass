"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpMic = exports.saveSettings = exports.loadAudioDevices = exports.openSoundFileDialog = void 0;
const electron_1 = require("electron");
const renderer_1 = require("./renderer");
function openSoundFileDialog() {
    electron_1.ipcRenderer.send('open-sound-file-dialog');
}
exports.openSoundFileDialog = openSoundFileDialog;
let outputSelect1;
let outputSelect2;
let outputRange1;
let outputRange2;
let newOutputSelect1Index;
let newOutputSelect2Index;
let storeLoaded = false;
function loadAudioDevices() {
    let filteredOutputDevices = [];
    outputSelect1 = document.getElementById('output-select-1');
    outputSelect2 = document.getElementById('output-select-2');
    outputRange1 = document.getElementById('output-range-1');
    outputRange2 = document.getElementById('output-range-2');
    navigator.mediaDevices.enumerateDevices().then(devices => {
        filteredOutputDevices = devices.filter(device => device.kind === "audiooutput");
        outputSelect1.addEventListener('change', (event) => {
            changeOutputDevice1(outputSelect1.selectedIndex, filteredOutputDevices, false);
            saveSettings();
        });
        outputSelect2.addEventListener('change', (event) => {
            changeOutputDevice2(outputSelect2.selectedIndex, filteredOutputDevices, false);
            saveSettings();
        });
        outputRange1.addEventListener('input', (event) => {
            let newValue = +outputRange1.value / 100;
            renderer_1.audio.volume = newValue;
            renderer_1.voice.volume = newValue;
            saveSettings();
        });
        outputRange2.addEventListener('input', (event) => {
            let newValue = +outputRange2.value / 100;
            renderer_1.audio2.volume = newValue;
            renderer_1.voice2.volume = newValue;
            saveSettings();
        });
        let outputDevicesToSend = [];
        for (const key of filteredOutputDevices) {
            outputDevicesToSend.push(key.label);
        }
        for (const key of filteredOutputDevices) {
            let el1 = document.createElement("option");
            el1.innerHTML = key.label;
            outputSelect1.appendChild(el1);
            let el2 = document.createElement("option");
            el2.innerHTML = key.label;
            outputSelect2.appendChild(el2);
        }
        if (storeLoaded) {
            outputSelect1.selectedIndex = newOutputSelect1Index;
            outputSelect2.selectedIndex = newOutputSelect2Index;
            changeOutputDevice1(outputSelect1.selectedIndex, filteredOutputDevices, true);
            changeOutputDevice2(outputSelect2.selectedIndex, filteredOutputDevices, true);
        }
        electron_1.ipcRenderer.send('register-output-devices-2', outputDevicesToSend);
        electron_1.ipcRenderer.send('register-output-devices-1', outputDevicesToSend);
    });
    electron_1.ipcRenderer.on('change-output-device-1', (event, device) => {
        changeOutputDevice1(device, filteredOutputDevices, true);
    });
    electron_1.ipcRenderer.on('change-output-device-2', (event, device) => {
        changeOutputDevice2(device, filteredOutputDevices, true);
    });
}
exports.loadAudioDevices = loadAudioDevices;
function changeOutputDevice1(device, filteredOutputDevices, fromRenderer) {
    renderer_1.audio.setSinkId(filteredOutputDevices[device].deviceId);
    renderer_1.voice.setSinkId(filteredOutputDevices[device].deviceId);
    if (fromRenderer) {
        outputSelect1.selectedIndex = device;
    }
    else {
        electron_1.ipcRenderer.send('change-output-menu', 1, device);
    }
    saveSettings();
}
function changeOutputDevice2(device, filteredOutputDevices, fromRenderer) {
    renderer_1.audio2.setSinkId(filteredOutputDevices[device].deviceId);
    renderer_1.voice2.setSinkId(filteredOutputDevices[device].deviceId);
    if (fromRenderer) {
        outputSelect2.selectedIndex = device;
    }
    else {
        electron_1.ipcRenderer.send('change-output-menu', 2, device);
    }
    saveSettings();
}
function saveSettings() {
    electron_1.ipcRenderer.send('save-settings', {
        outputSelect1: outputSelect1.selectedIndex,
        outputSelect2: outputSelect2.selectedIndex,
        outputRange1: outputRange1.value,
        outputRange2: outputRange2.value,
        mute: renderer_1.voice.muted
    });
}
exports.saveSettings = saveSettings;
function setUpMic() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
        renderer_1.mic.srcObject = stream;
        renderer_1.voice.srcObject = stream;
        renderer_1.voice2.srcObject = stream;
    }).catch(err => console.error(err));
}
exports.setUpMic = setUpMic;
electron_1.ipcRenderer.on('load-settings', (event, settings) => {
    storeLoaded = true;
    newOutputSelect1Index = settings.outputSelect1;
    newOutputSelect2Index = settings.outputSelect2;
    outputRange1.value = settings.outputRange1;
    outputRange2.value = settings.outputRange2;
    renderer_1.audio.volume = settings.outputRange1 / 100;
    renderer_1.voice.volume = settings.outputRange1 / 100;
    renderer_1.audio2.volume = settings.outputRange2 / 100;
    renderer_1.voice2.volume = settings.outputRange2 / 100;
    if (settings.mute)
        document.getElementById('mute').click();
});
