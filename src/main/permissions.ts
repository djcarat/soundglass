import { session, systemPreferences } from 'electron'

export function initPermissions() {

    session.defaultSession.setPermissionRequestHandler((webContens, permission, callback) => {
         if (permission === "media") 
            callback(true)
        else callback(false)
     })

    if (process.platform === "darwin") {
        try {
            systemPreferences.askForMediaAccess('microphone')
        } catch (err) {
            console.log(err)
        }
    }
    
}