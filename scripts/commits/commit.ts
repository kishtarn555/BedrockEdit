import { BlockPermutation, Dimension, Vector3 } from "@minecraft/server"

interface Change {
    dimension:Dimension
    previousState?:BlockPermutation
    nextState:BlockPermutation
    location: Vector3
}

class Commit {
    changes: Change[] = []
    setBlockPermutation(dimension:Dimension, location:Vector3, blockPermutation:BlockPermutation) {
        let newChange:Change = {
            dimension:dimension,
            location:location,
            previousState:dimension.getBlock(location)?.permutation, //NOTE: Does this need a clone (beta only as of 1/nov/2023)?
            nextState:blockPermutation
        }
        this.changes.push(newChange)
        dimension.getBlock(location)?.setPermutation(blockPermutation)
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