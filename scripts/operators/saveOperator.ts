import { Player } from "@minecraft/server";
import { Operator } from "./operator";
import { OperatorResult } from "./operatorResult";
import { TickChain } from "../tickScheduler/scheduler";
import { OperatorReturner } from "./operatorReturner";
import Workspace from "../workspace";
import { PlayerSession } from "../session/playerSession";
import { getPlayerSession } from "../session/playerSessionRegistry";
import { SaveOperatorArgsModal } from "../modals/SaveOperatorArgsModal";
import { loadAllStructureIdentifiers, saveStructureRegister } from "../db/dbStructures";

export interface SaveArguments {
    name?:string,

}

export class OperatorStructureSave implements Operator<SaveArguments> {
    requiresParameters: boolean;
    parameters: SaveArguments;
    player: Player;
    session:PlayerSession
    workspace?:Workspace
    
    constructor(player:Player, parameters:SaveArguments) {
        this.requiresParameters = true;
        this.player = player;
        this.parameters = parameters;
        this.session = getPlayerSession(player.name);
        this.workspace = this.session.getWorkspace()
    }

    private async getArguments() {
        if (
            this.parameters.name == null 
        ) {
            let modal = new SaveOperatorArgsModal();
            this.parameters = await modal.show(this.player); 
        }
    }

    async execute(): Promise<OperatorResult> {
        try {
            await this.getArguments();
        } catch (err) {
            if (err === "cancelled") {
                return {
                    status: "error",
                    message: { translate: "bets.modal.arguments.cancelled" }
                }
            }
        }

        return new TickChain<undefined, OperatorResult>()
            .first(this.validate.bind(this))
            .finally(this.saveStructure.bind(this))
            .run(undefined);

    }

    private async validate(returner:OperatorReturner) {
        if (this.parameters.name == null) {
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: { translate: "bets.operator.save.name" }
                }
            });
            return;
        }
        const pattern = /^([a-zA-Z][a-zA-Z0-9_]*)(:([a-zA-Z][a-zA-Z0-9_]*))?$/
        if (!pattern.test(this.parameters.name)) {

            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.save.miss_format"
                }
            });
            return;
        }

        if (this.workspace == null) {
            returner.breakAndReturn({
                status: "error",
                message: { text: "There's no valid selection" }
            });
            return;
        }


    }

    private async saveStructure(returner: OperatorReturner):Promise<OperatorResult> {
        const corner1 = this.workspace!.corner1;
        const corner2 = this.workspace!.corner2;

        const {x,y,z} = this.workspace!.getDimensions();
        const command = 
            `structure save ${this.parameters.name!} ${corner1.x} ${corner1.y} ${corner1.z} ${corner2.x} ${corner2.y} ${corner2.z} disk`
        
        let response = this.player.runCommand(command).successCount;

        if (response === 1) {
            saveStructureRegister(
                this.parameters.name!,
                {
                    identifier:this.parameters.name!,
                    x_length:x,
                    y_length:y,
                    z_length:z,
                    dx:this.player.getViewDirection().x,
                    dz:this.player.getViewDirection().z,
                }
            )
            return {
                message: { translate: "bets.operator.save.message.success" },
                status: "success"                
            }
        } else {
            return {
                message: { translate: "bets.operators.save.message.failed"},
                status:"error"
            }
        }
    }

}