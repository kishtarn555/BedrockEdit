import { ModalFormData } from "@minecraft/server-ui";
import { StackParameters } from "../operators/stackOperator";
import { Direction, Player } from "@minecraft/server";

export class StackOperatorArgsModal {
    modal : ModalFormData
    constructor () {
        this.modal = new ModalFormData();
        this.modal
            .title(
                {
                    translate:"bets.modal.operator_arguments.title", 
                    with: [
                        "bets.operator.stack.name"
                    ]
                })
            .dropdown(
                {
                    translate:"bets.operator.stack.direction"
                },
                [
                    {translate:"bets.util.directions.up"},   
                    {translate:"bets.util.directions.down"},   
                    {translate:"bets.util.directions.north"},   
                    {translate:"bets.util.directions.east"},   
                    {translate:"bets.util.directions.south"},  
                    {translate:"bets.util.directions.west"},   
                ]
            )
            .dropdown(
                {
                    translate:"bets.operator.stack.mode.name"
                },
                [
                    {translate:"bets.operator.stack.mode.masked"},
                    {translate:"bets.operator.stack.mode.replace"}
                ]
            )
            .slider(
                { translate:"bets.operator.stack.copies_count" },
                1,
                30,
                1,
                1
            )
    }


    async show(player:Player):Promise<StackParameters> {
        const response = await this.modal.show(player);
        if (response.canceled) {
            throw "cancelled";
        }
        const direction = [
            Direction.Up,
            Direction.Down,
            Direction.North,
            Direction.East,
            Direction.South,
            Direction.West
        ][response.formValues![0] as number];
        const mode = ["masked", "replace"]
            [response.formValues![1] as number] as "masked"|"replace";
        const copies = response.formValues![2] as number;

        return {
            direction:direction,
            mask:mode,
            copies:copies,
        }


        

    }
}