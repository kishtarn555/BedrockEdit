import {Vector3, world} from "@minecraft/server"


const MAX_STRING_BITE=900;

interface dbCompatible {
    setDynamicProperty(identifier: string, value?: string | number | boolean | Vector3): void;
    getDynamicProperty(identifier: string): string | number | boolean | Vector3 | undefined;
  
}

export namespace db  {

    export function loadString(head:string, defaultValue?:string, target?: dbCompatible):string {
        if (target == null) {
            target = world;
        }
        let itr = 0;
        let response = "";
        while (true) {
            let current = target.getDynamicProperty(`${head}.${itr}`);
            itr++;
            if (current == null) break;
            response += current as string;
        }
        if (response === "" && defaultValue != null) {
            return defaultValue
        }
        return response;
    }


    export function saveString(head:string, message:string, target?: dbCompatible) {
        if (target == null) {
            target = world;
        }
        const pattern = new RegExp(`.{1,${MAX_STRING_BITE}}`,"g");
        const tokens = message.match(pattern)!;

        let itr=0;
        for (let token of tokens) {
            target.setDynamicProperty(`${head}.${itr}`, token);
            itr++;
        }
        let current = target.getDynamicProperty(`${head}.${itr}`);
        while (current != null) {
            target.setDynamicProperty(`${head}.${itr}`, undefined);
            itr++;
            current = target.getDynamicProperty(`${head}.${itr}`);
        }
    }
}

