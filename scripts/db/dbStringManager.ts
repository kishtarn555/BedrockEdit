import {world} from "@minecraft/server"


const MAX_STRING_BITE=900;
export namespace db  {

    export function loadString(head:string, defaultValue?:string):string {
        let itr = 0;
        let response = "";
        while (true) {
            let current = world.getDynamicProperty(`${head}.${itr}`);
            itr++;
            if (current == null) break;
            response += current as string;
        }
        if (response === "" && defaultValue != null) {
            return defaultValue
        }
        return response;
    }


    export function saveString(head:string, message:string) {
        const pattern = new RegExp(`.{1,${MAX_STRING_BITE}}`,"g");
        const tokens = message.match(pattern)!;

        let itr=0;
        for (let token of tokens) {
            world.setDynamicProperty(`${head}.${itr}`, token);
            itr++;
        }
    }
}

