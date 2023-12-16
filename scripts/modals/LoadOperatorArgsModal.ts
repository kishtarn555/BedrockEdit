import { ModalFormData } from "@minecraft/server-ui";
import { SaveArguments } from "../operators/saveOperator";
import { Direction, Player } from "@minecraft/server";
import { getInteger } from "./modalsUtil";
import { LoadArguments, StructureMirror, StructureRotation } from "../operators/loadOperator";
import { loadStructureRegister } from "../db/dbStructures";


const ROTATIONS: StructureRotation[] = [
    "0_degrees",
    "90_degrees",
    "180_degrees",
    "270_degrees",
]
const MIRRORS: StructureMirror[] = [
    "none",
    "x",
    "z",
    "xz",
]

export class LoadOperatorArgsModal {
    modal: ModalFormData

    constructor(args: LoadArguments) {
        this.modal = new ModalFormData();
        this.modal
            .title(
                {
                    translate: "bets.modal.operator_arguments.title",
                    with: { rawtext: [{ translate: "bets.operator.load.name" }] }

                })

            .textField(
                {
                    translate: "bets.operator.load.arg_name"
                },
                "mystructure:structure",
                args.name
            )
            .dropdown(
                {
                    translate: "bets.operator.load.arg_rotation.name"
                },
                [{ translate: "bets.operator.load.arg_rotation.from_player" }, "0", "90", "180", "270"],
                args.rotation === "0_degrees" ? 1 :
                    args.rotation === "90_degrees" ? 2 :
                        args.rotation === "180_degrees" ? 3 :
                            args.rotation === "270_degrees" ? 4 :
                                0
            )
            .dropdown(
                {
                    translate: "bets.operator.load.arg_mirror.name"
                },
                [{ translate: "bets.operator.load_arg_mirror.none" }, "x", "z", "xz"],
                args.mirror === "none" ? 0 :
                    args.mirror === "x" ? 1 :
                        args.mirror === "z" ? 2 :
                            args.mirror === "xz" ? 3 :
                                0
            )

    }

    private solveRotation(rotIdx: number, name: string, player: Player): StructureRotation {
        if (rotIdx > 0) {
            return ROTATIONS[rotIdx - 1];
        }
        const structureData = loadStructureRegister(name);
        if (structureData == null) {
            return ROTATIONS[1];
        }
        const v2 = {
            x: player.getViewDirection().x,
            z: player.getViewDirection().z,
        }
        let dots = []
        let mx = -1;
        for (let i = 0; i < 4; i++) {
            let x = v2.x;
            let z = v2.z;
            let dotProduct = x * structureData.dx + z * structureData.dz;
            if (dotProduct > mx) {
                mx = dotProduct;
            }
            dots.push(dotProduct);
            v2.x = z;
            v2.z = -x;

        }
        for (let i=0; i < 4; i++) {
            if (mx===dots[i]) {
                return ROTATIONS[i];
            }
        }
        return ROTATIONS[0];

    }

    async show(player: Player): Promise<LoadArguments> {
        let params: LoadArguments = {}


        const modalResponse = await this.modal.show(player);
        if (modalResponse.canceled) {
            throw "cancelled";
        }

        params.name = modalResponse.formValues![0] as string;
        const rotIdx = modalResponse.formValues![1] as number;
        params.rotation = this.solveRotation(rotIdx, params.name, player);
        params.mirror = MIRRORS[modalResponse.formValues![2] as number];

        return params;




    }
}