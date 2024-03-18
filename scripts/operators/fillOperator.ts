import { Dimension, Player, Vector3, world } from "@minecraft/server"
import { OperatorResult } from "./operatorResult"
import { Operator } from "./operator"
import { Commit } from "../commits/commit"
import History from "../commits/history"
import Workspace from "../workspace"
import { ChainReturner, TickChain, TickForeach, TickTimeForeach } from "../tickScheduler/scheduler"
import { OperatorReturner } from "./operatorReturner"
import BlockPlacingModeSelectionModal from "../modals/BlockPlacingModeModal"
import { PlayerSession } from "../session/playerSession"
import { getPlayerSession } from "../session/playerSessionRegistry"
import { BlockPlacingMode } from "../blockPlacer"
interface FillParameters {
    mode?:"normal"|"keep"|"replace"|"loosely"
}
export default class OperatorFill implements Operator<FillParameters> {

    requiresParameters: boolean = false
    parameters: FillParameters
    player: Player;
    session: PlayerSession
    workspace: Workspace | undefined

    constructor(player: Player, parameters: FillParameters) {
        this.parameters = parameters;
        this.player = player;
        this.session = getPlayerSession(player.name);
        this.workspace = this.session.getWorkspace();
        
    }

    async getParameters() {

        if (this.parameters.mode != null) {
            const session = getPlayerSession(this.player.name);
            switch(this.parameters.mode) {
                case "normal":
                    session.blockPlacingMode = BlockPlacingMode.normal;
                    break;
                case "keep":
                    session.blockPlacingMode = BlockPlacingMode.keep;
                    break;
                case "replace":
                    session.blockPlacingMode = BlockPlacingMode.replaceExactly;
                    break;                    
                case "loosely":
                    session.blockPlacingMode = BlockPlacingMode.replaceLoosely;
                    break;
            }
            return true;
        }

        const chooseBlockPlacingMode = new BlockPlacingModeSelectionModal();
        
        try {
            await chooseBlockPlacingMode.show(this.player)
        } catch(error) {
            
            return false;
        }
        return true;
    }
    
    async execute(): Promise<OperatorResult> {
        let result = await this.getParameters();
        if (!result) {
            return{ 
                status: 'error', 
                message: {text:`Fill operator stopped: Form rejected`}
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
        if (!this.session.getBlockPlacer().isValid()) {
            returner.breakAndReturn({
                status: "error",
                message: {text:"Select the proper blocks"}
            });
            return;
        }
    }


    private async fill(returner: OperatorReturner): Promise<OperatorResult> {
        let pos1: Vector3 = this.session.selection.getMainAnchorBlockLocation()!
        let pos2: Vector3 = this.session.selection.getSecondaryAnchorBlockLocation()!


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
                    this.session.getBlockPlacer().placeBlock(
                        block, 
                        commit
                    );
                },
                250,
                (_) => {
                    
                    [commit, previousCommit] = commit.splitCommitIfLengthIsExceeded();
                    if (previousCommit != null) {
                        History.AddCommit(previousCommit);
                        previousCommit = null;
                    }
                }
            );
            await fors.runOnIterable(this.workspace!.iterable());
            History.AddCommit(commit);
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