"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProgressLevel = exports.disableAllActiveTabs = exports.setAudioListeners = exports.toggleSettings = void 0;
const electron_1 = require("electron");
const renderer_1 = require("./renderer");
electron_1.ipcRenderer.on('create-tab', (event, filePath) => createNewTab(filePath));
electron_1.ipcRenderer.on('show-tab-in-folder', () => {
    electron_1.shell.showItemInFolder(renderer_1.contextMenuTarget.getElementsByClassName('title')[0].dataset.path.slice(7));
});
electron_1.ipcRenderer.on('load-tabs', (event, tabs) => {
    if (tabs !== undefined)
        document.getElementById('tabList').innerHTML = tabs;
});
electron_1.ipcRenderer.on('remove-tab', () => {
    renderer_1.contextMenuTarget.classList.add('removed');
    setTimeout(() => {
        renderer_1.contextMenuTarget.remove();
        saveTabs();
        if (renderer_1.contextMenuTarget.getElementsByClassName('title')[0].dataset.path === renderer_1.audio.src) {
            renderer_1.audio.pause();
            renderer_1.audio2.pause();
        }
    }, 400);
});
let isRegisteringShortcut = false;
let registerShortcutEvent;
onkeypress = (key) => {
    if (isRegisteringShortcut) {
        isRegisteringShortcut = false;
        registerShortcut(key);
    }
};
electron_1.ipcRenderer.on('global-shortcut-called', (event, shortcut) => {
    if (shortcut.includes("numadd"))
        shortcut = shortcut.replace("numadd", "NUM+");
    else if (shortcut.includes("numsub"))
        shortcut = shortcut.replace("numsub", "NUM-");
    else if (shortcut.includes("numdec"))
        shortcut = shortcut.replace("numdec", "NUM.");
    else if (shortcut.includes("numult"))
        shortcut = shortcut.replace("numult", "NUM*");
    else if (shortcut.includes("numdiv"))
        shortcut = shortcut.replace("numdiv", "NUM/");
    let tabs = document.getElementsByClassName('tab');
    shortcut = shortcut.split("+").join(" ");
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].getElementsByClassName('shortcut')[0].innerHTML === shortcut) {
            tabs[i].click();
        }
    }
});
function saveTabs() {
    electron_1.ipcRenderer.send('save-tabs', document.getElementById('tabList').innerHTML);
}
function toggleSettings() {
    let settingsIcon = document.getElementById('settings').getElementsByClassName('arrow')[0];
    let settingsContent = document.getElementById('settingsContent');
    if (!settingsContent.classList.contains('active')) {
        settingsIcon.classList.add('up');
        settingsIcon.classList.remove('down');
    }
    else {
        settingsIcon.classList.remove('up');
        settingsIcon.classList.add('down');
    }
    settingsContent.classList.toggle('active');
}
exports.toggleSettings = toggleSettings;
function createNewTab(filePath) {
    let newTab = document.createElement('div');
    let tabList = document.getElementById('tabList');
    newTab.innerHTML = `
        <span class="title" data-path="${filePath}">${filePath.replace(/^.*[\\\/]/, '').split('.').shift()}</span>
        <span class="shortcut">NONE</span>
        <div class="progress"></div>`;
    newTab.classList.add('tab');
    newTab.classList.add('tab-popup');
    newTab.onclick = () => tabClick(newTab);
    newTab.getElementsByClassName('shortcut')[0].onclick = (event) => startRegisteringShortcut(event);
    tabList.appendChild(newTab);
    saveTabs();
}
function startRegisteringShortcut(event) {
    event.stopPropagation();
    if (isRegisteringShortcut)
        return;
    event.target.innerText = "Register shortcut..";
    isRegisteringShortcut = true;
    registerShortcutEvent = event;
}
function registerShortcut(key) {
    let shortcut = "";
    if (key.ctrlKey)
        shortcut += "Ctrl ";
    if (key.altKey)
        shortcut += "Alt ";
    if (key.shiftKey)
        shortcut += "Shift ";
    if (key.location === 3) {
        shortcut += "Num";
    }
    if (key.code === "Space") {
        shortcut += "Space";
    }
    if (key.code === "NumpadEnter")
        return;
    shortcut += `${key.key}`;
    shortcut = shortcut.toUpperCase();
    registerShortcutEvent.target.innerText = shortcut;
    let shortcutToSend = shortcut;
    shortcutToSend = shortcutToSend.split(" ").join("+");
    electron_1.ipcRenderer.send('register-global-shortcut', shortcutToSend);
}
function tabClick(el) {
    if (el.classList.contains('active')) {
        el.classList.remove('active');
        renderer_1.audio.pause();
        renderer_1.audio2.pause();
    }
    else {
        disableAllActiveTabs();
        registerTabsEvents();
        el.classList.toggle('active');
        renderer_1.audio.src = el.getElementsByClassName('title')[0].dataset.path;
        renderer_1.audio.currentTime = 0;
        renderer_1.audio.load();
        renderer_1.audio.play().catch(exception => {
            console.error(exception);
            alert(`Couldn't load file "${renderer_1.audio.src}" :(
                Try to import this file again.`);
        });
        renderer_1.audio2.src = el.getElementsByClassName('title')[0].dataset.path;
        renderer_1.audio2.currentTime = 0;
        renderer_1.audio2.load();
        renderer_1.audio2.play();
    }
}
function setAudioListeners() {
    let active = document.getElementById('tabList').getElementsByClassName('active');
    setInterval(() => {
        if (active.length <= 0)
            return;
        if (renderer_1.audio.paused) {
            setProgressLevel('0');
            disableAllActiveTabs();
        }
        else {
            setProgressLevel(`${(renderer_1.audio.currentTime / renderer_1.audio.duration) * 100}%`);
        }
    }, 1);
}
exports.setAudioListeners = setAudioListeners;
function registerTabsEvents() {
    for (let i = 0; i < document.getElementById('tabList').getElementsByClassName('tab').length; i++) {
        let element = document.getElementById('tabList').getElementsByClassName('tab')[i];
        element.onclick = () => tabClick(element);
    }
}
function disableAllActiveTabs() {
    for (let i = 0; i < document.getElementById('tabList').getElementsByClassName('tab').length; i++) {
        let element = document.getElementById('tabList').getElementsByClassName('tab')[i];
        element.classList.remove('active');
    }
}
exports.disableAllActiveTabs = disableAllActiveTabs;
function setProgressLevel(progress) {
    let active = document.getElementById('tabList').getElementsByClassName('active');
    if (active.length > 0) {
        active[0].getElementsByClassName('progress')[0].style.width = progress;
    }
}
exports.setProgressLevel = setProgressLevel;
