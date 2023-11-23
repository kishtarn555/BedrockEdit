import { BlockPermutation, Dimension, Vector3 } from "@minecraft/server"

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
    inHistory:boolean

    constructor (message:string, part?:number) {
        this.message =message
        this.part = part ?? 0
        this.inHistory=false;
    }


    splitCommitIfLengthIsExceeded():[Commit, Commit | null] {
        if (this.changes.length > MAX_COMMIT_LENGTH) {
            
            return [new Commit(this.message, this.part+1), this]
        }
        return [this, null];
    }

    saveChange(dimension:Dimension, location:Vector3, previousState:BlockPermutation, nextState:BlockPermutation ) {
        this.changes.push({
            dimension:dimension,
            location:location,
            previousState:previousState,
            nextState:nextState
        })
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