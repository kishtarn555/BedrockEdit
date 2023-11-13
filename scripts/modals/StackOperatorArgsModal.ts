import { ModalFormData } from "@minecraft/server-ui";
import { StackParameters } from "../operators/stackOperator";
import { Direction, Player } from "@minecraft/server";
import { getInteger } from "./modalsUtil";

export class StackOperatorArgsModal {
    modal: ModalFormData
    directionModal: ModalFormData
    offsetModal: ModalFormData
    constructor(defaultDirection?: Direction) {
        this.modal = new ModalFormData();
        this.directionModal = new ModalFormData();
        this.offsetModal = new ModalFormData();
        let direction = 0;
        if (defaultDirection != null) {
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
                    translate: "bets.operator.stack.mode"
                },
                [
                    { translate: "bets.operator.stack.mode.masked" },
                    { translate: "bets.operator.stack.mode.replace" }
                ]
            )
            .textField(
                { translate: "bets.operator.stack.copies_count" },
                {translate:"bets.util.integer"}
            )
            .dropdown(
                { translate: "bets.operator.stack.offset_type" },
                [
                    { translate: "bets.operator.stack.use_direction" },
                    { translate: "bets.operator.stack.use_offset" }
                ]
            );

        this.offsetModal
            .title({
                translate: "bets.operator.stack.offset"
            })
            .textField(
                { translate: "bets.operator.stack.dx" },
                {translate:"bets.util.integer"},
                "0"
            )
            .textField(
                { translate: "bets.operator.stack.dy" },
                {translate:"bets.util.integer"},
                "0"
            )
            .textField(
                { translate: "bets.operator.stack.dz" },
                {translate:"bets.util.integer"},
                "0"
            );

        this.directionModal
            .title({
                translate: "bets.operator.stack.offset"
            })
            .dropdown(
                { translate: "bets.operator.stack.direction" },
                [
                    { translate: "bets.util.directions.up" },
                    { translate: "bets.util.directions.down" },
                    { translate: "bets.util.directions.north" },
                    { translate: "bets.util.directions.east" },
                    { translate: "bets.util.directions.south" },
                    { translate: "bets.util.directions.west" },
                ],
                direction
            );

    }
    private getDefaultDirection(direction: Direction): number {
        switch (direction) {
            case Direction.Up: return 0;
            case Direction.Down: return 1;
            case Direction.North: return 2;
            case Direction.East: return 3;
            case Direction.South: return 4;
            case Direction.West: return 5;
        }
    }

    async show(player: Player): Promise<StackParameters> {
        let params: StackParameters = {}


        const modalResponse = await this.modal.show(player);
        if (modalResponse.canceled) {
            throw "cancelled";
        }

        params.mask = ["masked", "replace"][modalResponse.formValues![0] as number] as "masked" | "replace";
        params.copies = getInteger(modalResponse.formValues![1] as string, [1, 100]);
        const useOffset = modalResponse.formValues![2] === 1;
        params.useOffset = useOffset;
        if (!useOffset) {
            const directionResponse = await this.directionModal.show(player);
            if (directionResponse.canceled) {
                throw "cancelled"
            }
            params.direction = [
                Direction.Up,
                Direction.Down,
                Direction.North,
                Direction.East,
                Direction.South,
                Direction.West
            ][directionResponse.formValues![0] as number];
        } else {
            const offsetResponse = await this.offsetModal.show(player);
            if (offsetResponse.canceled) {
                throw "cancelled"
            }
            let x = getInteger(offsetResponse.formValues![0] as string);
            let y = getInteger(offsetResponse.formValues![1] as string);
            let z = getInteger(offsetResponse.formValues![2] as string);
            if (x != null && y!=null && z != null) {
                params.offset = {x:x,y:y,z:z};
            }
        }

        return params;




    }
}