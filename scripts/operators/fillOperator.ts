import { CommandError, Vector3, world } from "@minecraft/server"
import { BetsBlocks, BetsCoords } from "../variables"
import OperatorResult from "./OperatorResult"
import BtsOperator from "./Operator"
import { Commit } from "../commits/commit"
import History from "../commits/history"

export default class OperatorFill extends BtsOperator {
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
    
            
            //NOTE: This might need a bump after fillBlocks is added
            let x1 = Math.min(pos1.x, pos2.x);
            let x2 = Math.max(pos1.x, pos2.x);
            let y1 = Math.min(pos1.y, pos2.y);
            let y2 = Math.max(pos1.y, pos2.y);
            let z1 = Math.min(pos1.z, pos2.z);
            let z2 = Math.max(pos1.z, pos2.z);
            let area = (x2-x1+1)*(y2-y1+1)*(z2-z1+1);
            let commit:Commit=new  Commit(`Fill operation ${area} blocks`);
            let blocksChanged=0;
            for (let x=x1; x <= x2; x++)
                for (let y=y1; y <= y2; y++)
                    for (let z=z1; z <= z2; z++) {
                
                    // world.getDimension(dimension).runCommand(`setblock ${point.x} ${point.y} ${point.z} ${blockStatement}`);
                    //FIXME: Support multidimension
                    //FIXME: Add arguments
                    let point = {x:x,y:y,z:z};
                    let block = world.getDimension("overworld").getBlock(point)
                    if (block == null) continue;
                    blocksChanged++;
                    commit.setBlockPermutation(world.getDimension("overworld"), point, BetsBlocks.getBlock1()!);
            }
            History.AddCommit(commit);
            return {
                status: area===blocksChanged?"success":"warning",
                message: `Filled ${blocksChanged}/${area}`
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