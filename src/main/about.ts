import { app } from "electron";

app.setAboutPanelOptions({
    applicationName: app.name,
    applicationVersion: app.getVersion(),
    credits: 'Made by Maksymilian "pixl" Sroka',
    authors: ['Made by Maksymilian "pixl" Sroka'],
    copyright: 'Licensed under GNU GPLv3'
})