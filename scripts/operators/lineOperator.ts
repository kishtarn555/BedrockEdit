import { Dimension, Player, Vector3, world } from "@minecraft/server"
import { OperatorResult } from "./operatorResult"
import { Operator } from "./operator"
import { Commit } from "../commits/commit"
import History from "../commits/history"
import Workspace from "../workspace"
import { ChainReturner, TickChain, TickForeach } from "../tickScheduler/scheduler"
import { OperatorReturner } from "./operatorReturner"
import { FormRejectError } from "@minecraft/server-ui"
import { plot3D } from "../BresenhamLine"
import { PlayerSession } from "../session/playerSession"
import { getPlayerSession } from "../session/playerSessionRegistry"
import BlockPlacer from "../blockPlacer"
interface FillParameters {

}
export default class OperatorLine implements Operator<FillParameters> {

    requiresParameters: boolean = false
    parameters: FillParameters
    player: Player;
    session:PlayerSession
    workspace: Workspace | undefined

    constructor(player: Player, parameters: FillParameters) {
        this.parameters = parameters;
        this.player = player;
        this.session = getPlayerSession(player.name);
        this.workspace = this.session.getWorkspace();

    }

    execute(): Promise<OperatorResult> {
        return new Promise((resolve, reject)=>resolve(this.run()))
    }

    private run(): OperatorResult {
        if (!this.session.hasValidWorkspace()) {
            return {
                status: "error",
                message: {text:"Positions are not valid"}
            }
    
        }
        if (!BlockPlacer.validateSelection(this.session.blockSelection, this.session.blockPlacingMode)) {
            return {
                status: "error",
                message: {text:"No block picked"}
            }
    
        }
        //NOTE: when fillblocks is released, we might want to upgrade to it 
        let result: OperatorResult
        try {
            let pos1: Vector3 = this.session.selection.getMainAnchorBlockLocation()!
            let pos2: Vector3 = this.session.selection.getSecondaryAnchorBlockLocation()!
    
            let points = plot3D(
                pos1.x,
                pos1.y,
                pos1.z,
                pos2.x,
                pos2.y,
                pos2.z,
            )
            let commit:Commit=new  Commit("Line operation");
            const length = points.length;
            let blocksChanged = 0;
            //NOTE: This might need a bump after setBlocks is added
            for (const point of points) {
                // world.getDimension(dimension).runCommand(`setblock ${point.x} ${point.y} ${point.z} ${blockStatement}`);
                //FIXME: Support multidimension
                //FIXME: Add arguments
                let block = world.getDimension("overworld").getBlock(point)
                if (block == null) continue;
                this.session.getBlockPlacer().placeBlock(
                    block, 
                    commit
                );
                blocksChanged++;
            }
            History.AddCommit(commit);
            return {
                status: length === blocksChanged?"success":"warning",
                message: {text:`Line placed, set ${blocksChanged}/${length} blocks`}
            }
            
        } catch (error) {
           
            // @ts-ignore
            world.sendMessage(error.message) 
        }
        return {
            status: "error",
            message: {text:"THIS PATH SHOULD NOT BE ACCESSED, CONTACT DEV"}
        }
    
    }


}