import { Dimension, Player, Vector3 } from "@minecraft/server";
import BtsOperator from "./Operator";
import OperatorResult from "./OperatorResult";
import { PlayerVariablesConnection } from "../dataVariables/playerVariables";
import { ChainReturner, TickForeach } from "../tickScheduler/scheduler";
import { Commit } from "../commits/commit";
import History from "../commits/history";
import { BlockPlacingMode } from "../blockPlacer";


export class OperatorFlood extends BtsOperator {
    private pVars: PlayerVariablesConnection;
    location: Vector3
    dimension: Dimension

    constructor(player: Player, dimension: Dimension, effectLocation: Vector3) {
        super();
        this.player = player;
        this.dimension = dimension;
        this.location = effectLocation;
        this.pVars = new PlayerVariablesConnection(player);

    }


    form(): void {
        throw new Error("Method not implemented.");
    }


    run(): Promise<OperatorResult> {

        return new Promise<OperatorResult>((resolve, reject) => {
            const validation = this.validate();
            if (validation !== "success") {
                resolve({
                    status: "error",
                    message: validation
                });
                return;
            }
            const previousMode = this.pVars.getBlockPlacer().operationMode;
            this.pVars.getBlockPlacer().operationMode = BlockPlacingMode.normal;

            let commit = new Commit("flood");
            let changes = 0
            let flood = new TickForeach<Vector3>(
                (location) => { changes+=commit.placeBlock(this.player!.dimension, location, this.pVars) },
                500,
                (tick) => commit = new Commit(`Flood [${tick}]`),
                (_) => { History.AddCommit(commit) }
            ).runOnIterable(this.floodFill());
            flood.then(() => {

                this.pVars.getBlockPlacer().operationMode = previousMode;
                resolve(
                    {
                        status: "success",
                        message: `flood filled ${changes} blocks`

                    }
                );


            });
        });
    }
    private * floodFill() {
        let stack: Vector3[] = [this.location]
        let replacement = this.dimension.getBlock(this.location)?.permutation;   
        let dVector: Vector3[] = [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
        ]
        yield this.location;

        while (stack.length > 0) {
            let cur = stack.pop()!;
            for (let dt of dVector) {
                let next: Vector3 = { x: cur.x + dt.x, y: cur.y + dt.y, z: cur.z + dt.z }
                if (!this.pVars.getWorkspace()?.isInBound(next)) continue;
                if (this.dimension.getBlock(next)?.permutation!==replacement) continue;
                stack.push(next);
                yield next;
            }
        }
    }

    private validate(): string {
        if (!this.pVars.isValidWorkspace()) {
            return "No valid workspace defined";
        }
        if (!this.pVars.isBlockPlacerValid()) {
            return "No valid Block placer";
        }
        if (this.dimension.getBlock(this.location)===this.pVars.getBlock1()) {
            return "Cannot replace a block with the same block";
        }
        return "success";
    }
}