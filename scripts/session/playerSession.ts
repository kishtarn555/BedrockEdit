import { AreaSelection } from "./Selection";


export interface SessionData {
    selection:AreaSelection
}

export class PlayerSession {
    nameTag: string
    selection:AreaSelection


    constructor (nameTag:string, data?: SessionData) {
        this.nameTag = nameTag;
        this.selection = data?.selection ?? new  AreaSelection();

    }

}