import { Player, Vector3 } from "@minecraft/server";
import { Operator } from "./operator";
import { OperatorResult } from "./operatorResult";
import { TickChain } from "../tickScheduler/scheduler";
import { OperatorReturner } from "./operatorReturner";
import Workspace from "../workspace";
import History from "../commits/history"

import { PlayerSession } from "../session/playerSession";
import { getPlayerSession } from "../session/playerSessionRegistry";
import { LoadOperatorArgsModal } from "../modals/LoadOperatorArgsModal";
import { loadStructureRegister } from "../db/dbStructures";
import { MemoryArea } from "../commits/memoryArea";

export type StructureRotation = "0_degrees"|"90_degrees"|"180_degrees"|"270_degrees";
export type StructureMirror = "none"|"x"|"z"|"xz";

export interface LoadArguments {
    name?:string,
    rotation?:StructureRotation,
    mirror?:StructureMirror,
}

export class OperatorStructureLoad implements Operator<LoadArguments> {
    requiresParameters: boolean;
    parameters: LoadArguments;
    player: Player;
    session:PlayerSession
    
    constructor(player:Player, parameters:LoadArguments) {
        this.requiresParameters = true;
        this.player = player;
        this.parameters = parameters;
        this.session = getPlayerSession(player.name);
    }

    private async getArguments() {
        if (
            this.parameters.name == null ||
            this.parameters.mirror == null ||
            this.parameters.rotation == null
        ) {
            let modal = new LoadOperatorArgsModal(this.parameters);
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
            .finally(this.LoadStructure.bind(this))
            .run(undefined) ;

    }

    private async validate(returner:OperatorReturner) {
        if (this.parameters.name == null) {
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: { translate: "bets.operator.load.arg_name" }
                }
            });
            return;
        }
        if (this.parameters.rotation == null) {
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: { translate: "bets.operator.load.arg_rotation" }
                }
            });
            return;
        }
        if (this.parameters.mirror == null) {
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: { translate: "bets.operator.load.arg_mirror" }
                }
            });
            return;
        }
        
        const pattern = /^([a-zA-Z][a-zA-Z0-9_]*)(:([a-zA-Z][a-zA-Z0-9_]*))?$/
        if (!pattern.test(this.parameters.name)) {

            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.Load.miss_format"
                }
            });
            return;
        }

        if (this.session.selection.getMainAnchorBlockLocation() == null) {
            returner.breakAndReturn({
                status: "error",
                message: { text: "There's no corner1" }
            });
            return;
        }


    }

    private async LoadStructure(returner: OperatorReturner):Promise<OperatorResult> {
        let corner1 = this.session.selection.getMainAnchorBlockLocation()!
        let corner2 = this.session.selection.getSecondaryAnchorBlockLocation();
        const structureData = loadStructureRegister(this.parameters.name!);
        if (structureData == null) {
            return returner.breakAndReturn({
                message:{translate:"bets.operator.load.message.unknown_structure"},
                status:"error"
            });            
        }
        
        const rotated = (this.parameters.rotation != null && this.parameters.rotation == "90_degrees" ||this.parameters.rotation == "270_degrees" );
        let relative_x = !rotated? structureData.x_length : structureData.z_length;
        let relative_z = !rotated? structureData.z_length : structureData.x_length;


        if (corner2 != null) {
            if (corner2.x < corner1.x) {
                corner1.x -= relative_x-1;
            }
            if (corner2.y < corner1.y) {
                corner1.y -= structureData.y_length-1;
            }
            if (corner2.z < corner1.z) {
                corner1.z -= relative_z-1;
            }
        }
       

        const command = 
            `structure load ${this.parameters.name!} ${corner1.x} ${corner1.y} ${corner1.z} ${this.parameters.rotation} ${this.parameters.mirror}`
        
        let recordArea = new MemoryArea(this.player.dimension, corner1, {
            x:corner1.x+ relative_x -1,
            y:corner1.y+ structureData.y_length-1,
            z:corner1.z+ relative_z -1,
        })
        recordArea.record()
        let response = this.player.runCommandAsync(command).then(res=> {
            for (const commit of recordArea.getDifferences(`Load`)) {
                History.AddCommit(commit);
            }
            if (res.successCount === 1) {
            
                return {
                    message: { translate: "bets.operator.load.message.success" },
                    status: "success"                
                } as OperatorResult
            } else {
                return {
                    message: { translate: "bets.operators.load.message.failed"},
                    status:"error"
                } as OperatorResult
            } 
        });
        return response;
    }

}