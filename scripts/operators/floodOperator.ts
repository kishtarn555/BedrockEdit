import { Dimension, Player, Vector3 } from "@minecraft/server";
import { Operator } from "./operator";
import {OperatorResult} from "./operatorResult";
import { ChainReturner, TickForeach, TickTimeForeach } from "../tickScheduler/scheduler";
import { Commit } from "../commits/commit";
import History from "../commits/history";
import BlockPlacer, { BlockPlacingMode } from "../blockPlacer";
import { PlayerSession } from "../session/playerSession";
import { getPlayerSession } from "../session/playerSessionRegistry";


interface FloodParameters {
    location:Vector3
    dimension:Dimension

}

export class OperatorFlood implements Operator<FloodParameters> {
    requiresParameters: boolean = false; //I don't ko
    parameters: FloodParameters;
    player: Player;
    session:PlayerSession

    constructor(player: Player,parameters:FloodParameters) {
        this.player = player;
        this.parameters = parameters
        this.session = getPlayerSession(player.name);

    }


    execute(): Promise<OperatorResult> {

        return new Promise<OperatorResult>((resolve, reject) => {
            const validation = this.validate();
            if (validation !== "success") {
                resolve({
                    status: "error",
                    message: {text:validation}
                });
                return;
            }
            const blockPlacer =  new BlockPlacer(this.session.blockSelection, BlockPlacingMode.normal);

            let commit: Commit = new Commit(`Flood operation`) ;
            let previousCommit:Commit | null = null;
            let changes = 0
            let flood = new TickTimeForeach<Vector3>(
                (location) => { changes+=blockPlacer.placeBlock(this.player!.dimension.getBlock(location)!,  commit) },
                250,
                (_) => {
                    [commit, previousCommit] = commit.splitCommitIfLengthIsExceeded();
                    if (previousCommit != null) {
                        History.AddCommit(previousCommit);
                        previousCommit = null;
                    }
                },
                (_) => { }
            ).runOnIterable(this.floodFill());
            flood.then(() => {
                History.AddCommit(commit);
                resolve(
                    {
                        status: "success",
                        message: {text:`flood filled ${changes} blocks`}

                    }
                );


            });
        });
    }
    private * floodFill() {
        let stack: Vector3[] = [this.parameters.location]
        let replacement = this.parameters.dimension.getBlock(this.parameters.location)?.permutation;   
        let dVector: Vector3[] = [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
        ]
        yield this.parameters.location;

        while (stack.length > 0) {
            let cur = stack.pop()!;
            for (let dt of dVector) {
                let next: Vector3 = { x: cur.x + dt.x, y: cur.y + dt.y, z: cur.z + dt.z }
                if (!this.session.getWorkspace()?.isInBound(next)) continue;
                if (this.parameters.dimension.getBlock(next)?.permutation!==replacement) continue;
                stack.push(next);
                yield next;
            }
        }
    }

    private validate(): string {
        if (!this.session.hasValidWorkspace()) {
            return "No valid workspace defined";
        }
        if (!BlockPlacer.validateSelection(this.session.blockSelection, BlockPlacingMode.normal)) {
            return "No valid Block placer";
        }
        if (this.parameters.dimension.getBlock(this.parameters.location)?.permutation===this.session.blockSelection.mainBlockPermutation) {
            return "Cannot replace a block with the same block";
        }
        return "success";
    }
}