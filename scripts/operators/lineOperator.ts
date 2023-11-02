import { CommandError, Vector3, world } from "@minecraft/server"
import { BetsBlocks, BetsCoords } from "../variables"
import OperatorResult from "./OperatorResult"
import { plot3D } from "../BresenhamLine"
import BtsOperator from "./Operator"
import { Commit } from "../commits/commit"
import History from "../commits/history"

export default class OperatorLine extends BtsOperator {
    form(): void {
        
    }
    run(): OperatorResult {
        if (!BetsCoords.arePositionsValid()) {
            return {
                status: "error",
                message: "Positions are not valid"
            }
    
        }
        if (!BetsBlocks.isBlock1Valid()) {
            return {
                status: "error",
                message: "No block picked"
            }
    
        }
        //NOTE: when fillblocks is released, we might want to upgrade to it 
        let result: OperatorResult
        try {
            let pos1: Vector3 = BetsCoords.getBlock1()!
            let pos2: Vector3 = BetsCoords.getBlock2()!
    
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
                commit.setBlockPermutation(world.getDimension("overworld"), point, BetsBlocks.getBlock1()!);
                blocksChanged++;
            }
            History.AddCommit(commit);
            return {
                status: length === blocksChanged?"success":"warning",
                message: `Line placed, set ${blocksChanged}/${length} blocks`
            }
            
        } catch (error) {
           
            // @ts-ignore
            world.sendMessage(error.message) 
        }
        return {
            status: "error",
            message: "THIS PATH SHOULD NOT BE ACCESSED, CONTACT DEV"
        }
    
    }
    
}