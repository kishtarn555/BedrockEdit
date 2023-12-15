import { ModalFormData } from "@minecraft/server-ui";
import { SaveArguments } from "../operators/saveOperator";
import { Direction, Player } from "@minecraft/server";
import { getInteger } from "./modalsUtil";

export class SaveOperatorArgsModal {
    modal: ModalFormData
    
    constructor() {
        this.modal = new ModalFormData();
        this.modal
        .title(
            {
                translate: "bets.modal.operator_arguments.title",
                with: { rawtext: [{ translate: "bets.operator.save.name" }] }

            })

        .textField(
            {
                translate: "bets.operator.save.arg_name"
            },
            "mystructure:structure"
        )

    }
    

    async show(player: Player): Promise<SaveArguments> {
        let params: SaveArguments = {}


        const modalResponse = await this.modal.show(player);
        if (modalResponse.canceled) {
            throw "cancelled";
        }

        params.name = modalResponse.formValues![0] as string;

        return params;




    }
}