import { BlockStates, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

export class DebugStickModal {
    modal: ModalFormData
    states:Record<string, string| number| boolean>

    constructor(states: Record<string, string| number| boolean>) {
        this.states = states;
        this.modal = new ModalFormData();
        this.modal.title({
            translate: "bets.tools.debug_stick.item.name"
        });
        
        for (const key in states) {
            if (states.hasOwnProperty(key)) {
                const currentElement = states[key];
                
                if (typeof currentElement === 'boolean') {
                    this.modal.toggle(key, states[key] as boolean);
                } else if (typeof currentElement === 'string') {
                    let valid = BlockStates.get(key)?.validValues as string[];
                    this.modal.dropdown(key, valid, valid.indexOf(states[key] as string));
                }else if (typeof currentElement === 'number') {
                    let preValid = BlockStates.get(key)?.validValues as number[];
                    let valid:string[] = []
                    preValid.forEach(el => valid.push(`${el}`));
                    this.modal.dropdown(key, valid, preValid.indexOf(states[key] as number));
                }
                // No action for number type in this example
            }
        }


    }

    

    async show(player: Player): Promise<Record<string, string| number| boolean>> {
        let result: Record<string, string| number| boolean> = {}
        
        const modalResponse = await this.modal.show(player);
        if (modalResponse.canceled) {
            throw "cancelled";
        }
        let index =0;
        for (const key in this.states) {
            if (this.states.hasOwnProperty(key)) {
                const currentElement = this.states[key];
                
                if (typeof currentElement === 'boolean') {
                    result[key] = modalResponse.formValues![index] as boolean;
                } else if (typeof currentElement === 'string') {
                    result[key] = modalResponse.formValues![index] as string;
                }else if (typeof currentElement === 'number') {
                    result[key] = modalResponse.formValues![index] as number;
                }
                index++;
            }
        }

        return result;
    }
}
