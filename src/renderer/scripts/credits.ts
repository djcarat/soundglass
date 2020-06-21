import { shell } from "electron";

export function OpenURL(url: string) {
    shell.openExternal(url)
}