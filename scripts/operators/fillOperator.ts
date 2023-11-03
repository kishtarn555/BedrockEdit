import {  Dimension, Vector3, world } from "@minecraft/server"
import { BetsBlockPlacer, BetsBlocks, BetsCoords } from "../variables"
import OperatorResult from "./OperatorResult"
import BtsOperator, { OperatorReturner } from "./Operator"
import { Commit } from "../commits/commit"
import History from "../commits/history"
import Workspace from "../workspace"
import { ChainReturner, TickChain, TickForeach } from "../tickScheduler/scheduler"
export default class OperatorFill extends BtsOperator {

    workspace: Workspace | undefined
    dimension: Dimension | undefined
    form(): void {

    }
    run(): Promise<OperatorResult> {
        return new TickChain<undefined, OperatorResult>()
            .first(this.validate)
            .finally(this.fill.bind(this))
            .run(undefined);

    }
    private loadWorkspace() {
        this.workspace = new Workspace(BetsCoords.getBlock1()!, BetsCoords.getBlock2()!, this.dimension!, "fill_operator");
        this.workspace.load();
    }
    private async validate(returner: OperatorReturner) {
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

    private * coords(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                for (let z = z1; z <= z2; z++) {
                    yield { x: x, y: y, z: z };
                }
            }
        }

    }

    private async fill(returner: OperatorReturner): Promise<OperatorResult> {
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
        let blocksChanged = 0;
        let commit: Commit | undefined;
        try {
            let fors = new TickForeach(
                (pos: Vector3) => {

                    // world.getDimension(dimension).runCommand(`setblock ${point.x} ${point.y} ${point.z} ${blockStatement}`);
                    //FIXME: Support multidimension
                    //FIXME: Add arguments
                    let point = { x: pos.x, y: pos.y, z: pos.z };
                    let block = world.getDimension("overworld").getBlock(point)
                    if (block == null) return;
                    blocksChanged++;
                    commit!.setBlockPermutation(world.getDimension("overworld"), point, BetsBlocks.getBlock1()!);
                },
                500,
                (tick)=> { commit = new Commit(`Fill operation (${tick})`)},
                (_) => { History.AddCommit(commit!);}
            );
            // @ts-ignore
            await fors.runOnIterable(this.coords(x1, y1, z1, x2, y2, z2))
        } catch (error) {
            world.sendMessage((error as Error).stack ?? "lol")
        }
        return ({
            status: area === blocksChanged ? "success" : "warning",
            message: `Filled ${blocksChanged}/${area}`
        });

    }
    private unloadWorkspace() {

    }


}