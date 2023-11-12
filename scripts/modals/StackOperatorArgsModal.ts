import { ModalFormData } from "@minecraft/server-ui";
import { StackParameters } from "../operators/stackOperator";
import { Direction, Player } from "@minecraft/server";

export class StackOperatorArgsModal {
    modal: ModalFormData
    constructor(defaultDirection?:Direction) {
        this.modal = new ModalFormData();
        let direction = 0;
        if (defaultDirection!=null) {
            direction = this.getDefaultDirection(defaultDirection);
        }
        this.modal
            .title(
                {
                    translate: "bets.modal.operator_arguments.title",
                    with: { rawtext: [{ translate: "bets.operator.stack.name" }] }

                })
            .dropdown(
                {
                    translate: "bets.operator.stack.direction"
                },
                [
                    { translate: "bets.util.directions.up" },
                    { translate: "bets.util.directions.down" },
                    { translate: "bets.util.directions.north" },
                    { translate: "bets.util.directions.east" },
                    { translate: "bets.util.directions.south" },
                    { translate: "bets.util.directions.west" },
                ],
                direction
            )
            .dropdown(
                {
                    translate: "bets.operator.stack.mode.name"
                },
                [
                    { translate: "bets.operator.stack.mode.masked" },
                    { translate: "bets.operator.stack.mode.replace" }
                ]
            )
            .slider(
                { translate: "bets.operator.stack.copies_count" },
                1,
                30,
                1,
                1
            )
    }
    private getDefaultDirection(direction:Direction):number {
        switch(direction) {
            case Direction.Up: return 0;
            case Direction.Down: return 1;
            case Direction.North: return 2;
            case Direction.East: return 3;
            case Direction.South: return 4;
            case Direction.West: return 5;
        }
    }

    async show(player: Player): Promise<StackParameters> {
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
        [response.formValues![1] as number] as "masked" | "replace";
        const copies = response.formValues![2] as number;

        return {
            direction: direction,
            mask: mode,
            copies: copies,
        }




    }
}