import { BlockPermutation, Dimension, Vector3 } from "@minecraft/server"
import { BetsBlockPlacer, BetsBlocks } from "../variables"
import BlockPlacer from "../blockPlacer"
import { PlayerVariablesConnection } from "../dataVariables/playerVariables"

interface Change {
    dimension:Dimension
    previousState:BlockPermutation
    nextState:BlockPermutation
    location: Vector3
}

const MAX_COMMIT_LENGTH=10000

class Commit {
    changes: Change[] = []
    message:string
    part:number

    constructor (message:string, part?:number) {
        this.message =message
        this.part = part ?? 0
    }


    splitCommitIfLengthIsExceeded() {
        if (this.changes.length > MAX_COMMIT_LENGTH) {
            return new Commit(this.message, this.part+1)
        }
        return this;
    }

    saveChange(dimension:Dimension, location:Vector3, previousState:BlockPermutation, nextState:BlockPermutation ) {
        this.changes.push({
            dimension:dimension,
            location:location,
            previousState:previousState,
            nextState:nextState
        })
    }

    setBlockPermutation(dimension:Dimension, location:Vector3, blockPermutation:BlockPermutation) {
        let newChange:Change = {
            dimension:dimension,
            location:location,
            previousState:dimension.getBlock(location)?.permutation ?? blockPermutation,
            nextState:blockPermutation
        }
        this.changes.push(newChange);
        let block = dimension.getBlock(location);
        if (block == null) {
            return; //FIXME
        }
        BetsBlockPlacer.setBlockPermutation(block, BetsBlocks.getBlock1()!, BetsBlocks.getBlock2(),)
    }

    placeBlock(dimension:Dimension, location:Vector3, pVars:PlayerVariablesConnection) {
        let newChange:Change = {
            dimension:dimension,
            location:location,
            previousState:dimension.getBlock(location)?.permutation ?? pVars.getBlock1()!, 
            nextState: pVars.getBlock1()!
        }
        this.changes.push(newChange);
        let block = dimension.getBlock(location);
        if (block == null) {
            return 0; //FIXME
        }
        pVars.getBlockPlacer().setBlockPermutation(block, pVars.getBlock1()!, pVars.getBlock2())
        return 1;
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