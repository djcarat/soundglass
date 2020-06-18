"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mic = exports.voice = exports.audio = void 0;
const audioDevices_1 = require("./audioDevices");
const tabs_1 = require("./tabs");
const electron_1 = require("electron");
onload = () => {
    exports.audio = document.getElementById('sound');
    exports.voice = document.getElementById('voice');
    exports.mic = document.getElementById('mic');
    document.getElementById('newTab').onclick = () => audioDevices_1.openSoundFileDialog();
    audioDevices_1.loadAudioDevices();
    tabs_1.setAudioListeners();
    audioDevices_1.setUpMic();
    addEventListener('contextmenu', (event) => {
        let target = event.target;
        if (target.classList.contains("tab") && target.id != "newTab")
            electron_1.ipcRenderer.send('tab-menu-popup');
        else if (target === document.body || target.id === "tabList" || target.id === "newTab") {
            electron_1.ipcRenderer.send('blank-menu-popup');
        }
    });
};
