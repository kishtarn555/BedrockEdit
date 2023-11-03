import { CommandError, Dimension, Vector3, world } from "@minecraft/server"
import { BetsBlockPlacer, BetsBlocks, BetsCoords } from "../variables"
import OperatorResult from "./OperatorResult"
import BtsOperator, { OperatorReturner } from "./Operator"
import { Commit } from "../commits/commit"
import History from "../commits/history"
import Workspace from "../workspace"
import { ChainReturner, TickChain } from "../tickScheduler/scheduler"
export default class OperatorFill extends BtsOperator {

    workspace: Workspace | undefined
    dimension: Dimension | undefined
    form(): void {

    }
    run(): Promise<OperatorResult> {
        return new TickChain<undefined, OperatorResult>()
            .first(this.validate)
            .finally(this.fill)
            .run(undefined);

    }
    private loadWorkspace() {
        this.workspace = new Workspace(BetsCoords.getBlock1()!, BetsCoords.getBlock2()!, this.dimension!, "fill_operator");
        this.workspace.load();
    }
    private validate(returner: OperatorReturner) {
        if (!BetsCoords.isThereAValidWorkspace()) {
            returner.breakAndReturn({
                status: "error",
                message: "There's no valid workspace"
            });
            return;
        }
        if (!BetsBlockPlacer.isValid(BetsBlocks.getBlock1(), BetsBlocks.getBlock2())) {
            returner.breakAndReturn({
                status: "error",
                message: "Select the proper blocks"
            });
            return;
        }
    }

    private fill(returner: OperatorReturner): OperatorResult {
        let pos1: Vector3 = BetsCoords.getBlock1()!
        let pos2: Vector3 = BetsCoords.getBlock2()!


        //NOTE: This might need a bump after fillBlocks is added
        let x1 = Math.min(pos1.x, pos2.x);
        let x2 = Math.max(pos1.x, pos2.x);
        let y1 = Math.min(pos1.y, pos2.y);
        let y2 = Math.max(pos1.y, pos2.y);
        let z1 = Math.min(pos1.z, pos2.z);
        let z2 = Math.max(pos1.z, pos2.z);
        let area = (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1);
        let commit: Commit = new Commit(`Fill operation ${area} blocks`);
        let blocksChanged = 0;
        for (let x = x1; x <= x2; x++)
            for (let y = y1; y <= y2; y++)
                for (let z = z1; z <= z2; z++) {

                    // world.getDimension(dimension).runCommand(`setblock ${point.x} ${point.y} ${point.z} ${blockStatement}`);
                    //FIXME: Support multidimension
                    //FIXME: Add arguments
                    let point = { x: x, y: y, z: z };
                    let block = world.getDimension("overworld").getBlock(point)
                    if (block == null) continue;
                    blocksChanged++;
                    commit.setBlockPermutation(world.getDimension("overworld"), point, BetsBlocks.getBlock1()!);
                }
        History.AddCommit(commit);
        return ({
            status: area === blocksChanged ? "success" : "warning",
            message: `Filled ${blocksChanged}/${area}`
        });

    }
    private unloadWorkspace() {

    }


}