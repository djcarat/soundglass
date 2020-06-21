"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextMenuTarget = exports.mic = exports.voice2 = exports.audio2 = exports.voice = exports.audio = void 0;
const audioDevices_1 = require("./audioDevices");
const tabs_1 = require("./tabs");
const credits_1 = require("./credits");
const electron_1 = require("electron");
const topbar_1 = require("./topbar");
onload = () => {
    exports.audio = document.getElementById('sound');
    exports.voice = document.getElementById('voice');
    exports.mic = document.getElementById('mic');
    exports.audio2 = document.getElementById('sound-2');
    exports.voice2 = document.getElementById('voice-2');
    document.getElementById('newTab').onclick = () => audioDevices_1.openSoundFileDialog();
    document.getElementById('settings').onclick = () => tabs_1.toggleSettings();
    document.getElementById('source').onclick = () => credits_1.OpenURL("https://github.com/");
    document.getElementById('website').onclick = () => credits_1.OpenURL("https://duckduckgo.com/");
    document.getElementById('mute').onchange = () => {
        if (document.getElementById('mute').checked) {
            exports.voice.muted = true;
            exports.voice2.muted = true;
        }
        else {
            exports.voice.muted = false;
            exports.voice2.muted = false;
        }
        audioDevices_1.saveSettings();
    };
    topbar_1.initTopbar();
    audioDevices_1.loadAudioDevices();
    tabs_1.setAudioListeners();
    audioDevices_1.setUpMic();
    addEventListener('contextmenu', (event) => {
        let target = event.target;
        exports.contextMenuTarget = target;
        if (target.classList.contains("tab-popup"))
            electron_1.ipcRenderer.send('tab-menu-popup');
        else if (target.classList.contains("blank-popup")) {
            electron_1.ipcRenderer.send('blank-menu-popup');
        }
    });
    electron_1.ipcRenderer.send('get-settings');
    electron_1.ipcRenderer.send('get-tabs');
};
