import { BlockPermutation, Dimension, Vector3 } from "@minecraft/server"
import { BetsBlockPlacer, BetsBlocks } from "../variables"

interface Change {
    dimension:Dimension
    previousState?:BlockPermutation
    nextState:BlockPermutation
    location: Vector3
}

class Commit {
    changes: Change[] = []
    message:string

    constructor (message:string) {
        this.message =message
    }

    setBlockPermutation(dimension:Dimension, location:Vector3, blockPermutation:BlockPermutation) {
        let newChange:Change = {
            dimension:dimension,
            location:location,
            previousState:dimension.getBlock(location)?.permutation, //NOTE: Does this need a clone (beta only as of 1/nov/2023)?
            nextState:blockPermutation
        }
        this.changes.push(newChange);
        let block = dimension.getBlock(location);
        if (block == null) {
            return; //FIXME
        }
        BetsBlockPlacer.setBlockPermutation(block, BetsBlocks.getBlock1()!, BetsBlocks.getBlock2(),)
    }


    rollback() {
        for (let i = this.changes.length-1; i >=0; i--) {
            if (this.changes[i].previousState == null) continue;
            this.changes[i].dimension.getBlock(this.changes[i].location)?.setPermutation(this.changes[i].previousState!);
        }
    }

    redo() {
        for (let i =0; i < this.changes.length; i++) {
            this.changes[i].dimension.getBlock(this.changes[i].location)?.setPermutation(this.changes[i].nextState);
        }
    }
};


export {Commit}