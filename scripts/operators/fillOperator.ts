import { Dimension, Player, Vector3, world } from "@minecraft/server"
import { PlayerVariablesConnection } from "../dataVariables/playerVariables"
import { OperatorResult } from "./operatorResult"
import { Operator } from "./operator"
import { Commit } from "../commits/commit"
import History from "../commits/history"
import Workspace from "../workspace"
import { ChainReturner, TickChain, TickForeach, TickTimeForeach } from "../tickScheduler/scheduler"
import { OperatorReturner } from "./operatorReturner"
import BlockPlacingModeSelectionModal from "../modals/BlockPlacingModeModal"
interface FillParameters {

}
export default class OperatorFill implements Operator<FillParameters> {

    requiresParameters: boolean = false
    parameters: FillParameters
    player: Player;
    playerVariables: PlayerVariablesConnection
    workspace: Workspace | undefined

    constructor(player: Player, parameters: FillParameters) {
        this.parameters = parameters;
        this.player = player;
        this.playerVariables = new PlayerVariablesConnection(player);
        this.workspace = this.playerVariables.getWorkspace();
        
    }
    
    async execute(): Promise<OperatorResult> {
        const chooseBlockPlacingMode = new BlockPlacingModeSelectionModal();
        
        try {
            await chooseBlockPlacingMode.show(this.player)
        } catch(error) {
            
            return { 
                status: 'error', 
                message: {text:`Fill operator stopped: ${error}`}
            };
        }

        return new TickChain<undefined, OperatorResult>()
        .first(this.validate.bind(this))
        .finally(this.fill.bind(this))
        .run(undefined);
    }
    
    
    private loadWorkspace() {
        this.workspace!.load();
    }
    private async validate(returner: OperatorReturner) {
        if (this.workspace == null) {
            returner.breakAndReturn({
                status: "error",
                message: {text:"There's no valid workspace"}
            });
            return;
        }
        if (!this.playerVariables.isBlockPlacerValid()) {
            returner.breakAndReturn({
                status: "error",
                message: {text:"Select the proper blocks"}
            });
            return;
        }
    }


    private async fill(returner: OperatorReturner): Promise<OperatorResult> {
        let pos1: Vector3 = this.playerVariables.getBlockPos1()!
        let pos2: Vector3 = this.playerVariables.getBlockPos2()!


        //NOTE: This might need a bump after fillBlocks is added
        let x1 = Math.min(pos1.x, pos2.x);
        let x2 = Math.max(pos1.x, pos2.x);
        let y1 = Math.min(pos1.y, pos2.y);
        let y2 = Math.max(pos1.y, pos2.y);
        let z1 = Math.min(pos1.z, pos2.z);
        let z2 = Math.max(pos1.z, pos2.z);
        let area = (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1);
        let blocksChanged = 0;
        let commit: Commit = new Commit(`Fill operation`) ;
        let previousCommit:Commit | null = null;
        try {
            let fors = new TickTimeForeach(
                (pos: Vector3) => {

                    // world.getDimension(dimension).runCommand(`setblock ${point.x} ${point.y} ${point.z} ${blockStatement}`);
                    //FIXME: Support multidimension
                    //FIXME: Add arguments
                    let point = { x: pos.x, y: pos.y, z: pos.z };
                    let block = world.getDimension("overworld").getBlock(point)
                    if (block == null) return;
                    blocksChanged++;
                    this.playerVariables.getBlockPlacer().placeBlock(
                        block, 
                        this.playerVariables.getBlock1()!,
                        this.playerVariables.getBlock2(),
                        commit
                    );
                },
                250,
                (_) => {},
                (_) => {
                    
                    [commit, previousCommit] = commit.splitCommitIfLengthIsExceeded();
                    if (previousCommit != null) {
                        History.AddCommit(previousCommit);
                        previousCommit = null;
                    }
                }
            );
            await fors.runOnIterable(this.workspace!.iterable())
        } catch (error) {
            if (error === "cancelled") {
                return {
                    status:"error",
                    message: {text:"Run was cancelled"}
                }
            }
            if (error === "busy") {
                return {
                    status:"error",
                    message: {text:"Scheduler was busy"}
                }
            }
            world.sendMessage((error as Error).stack ?? "lol")
        }
        return ({
            status: area === blocksChanged ? "success" : "warning",
            message: {text:`Filled ${blocksChanged}/${area}`}
        });

    }
    private unloadWorkspace() {

    }


}