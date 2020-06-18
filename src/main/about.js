"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.app.setAboutPanelOptions({
    applicationName: electron_1.app.name,
    applicationVersion: electron_1.app.getVersion(),
    credits: 'Made by Maksymilian "pixl" Sroka',
    authors: ['Made by Maksymilian "pixl" Sroka'],
    copyright: 'Licensed under GNU GPLv3'
});
