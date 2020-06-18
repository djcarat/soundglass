"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPermissions = void 0;
const electron_1 = require("electron");
function initPermissions() {
    electron_1.session.defaultSession.setPermissionRequestHandler((webContens, permission, callback) => {
        if (permission === "media")
            callback(true);
        else
            callback(false);
    });
    if (process.platform === "darwin") {
        try {
            electron_1.systemPreferences.askForMediaAccess('microphone');
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.initPermissions = initPermissions;
