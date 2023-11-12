import { Block, BlockPermutation } from "@minecraft/server";
import { Commit } from "./commits/commit";
export default class BlockPlacer {
    
    isValid(primary?:BlockPermutation, secondary?:BlockPermutation) {
        if (primary==null) return false;
        if (this.operationMode == BlockPlacingMode.normal || this.operationMode == BlockPlacingMode.keep) {
            return true;
        }
        return secondary!=null;
    }
    
    operationMode:BlockPlacingMode = BlockPlacingMode.normal

    setBlockPermutation(block:Block, primary:BlockPermutation, secondary?:BlockPermutation) {
        switch (this.operationMode) {
            case BlockPlacingMode.normal:
                block.setPermutation(primary);
                break;
            case BlockPlacingMode.keep:
                if (block.isAir) {                    
                    block.setPermutation(primary);
                }
                break;
            case BlockPlacingMode.replaceExactly:
                if (secondary == null) {
                    throw new Error("Secondary block is not set");
                }
                if (block.permutation === secondary) {
                    block.setPermutation(primary);
                }
                break;
            default:
                throw new Error("Block placing mode is not supported");
        }
        return block.permutation

    }

    placeBlock(block: Block,  primary:BlockPermutation, secondary?:BlockPermutation, commit?:Commit)  :number{
        if (!block.isValid()) return 0;
        let previousState = block.permutation
        let nextState = this.setBlockPermutation(block, primary, secondary);
        if (nextState!==previousState) {
            commit?.saveChange(block.dimension,block.location, previousState, nextState);
            return 1;
        }
        return 0;
    }


}



export enum BlockPlacingMode {
    normal = 0, //Places blocks normally, independent of what replaces
    keep = 1, //Only replaces air blocks
    replaceExactly = 2,
    replaceLoosely = 3// IMPLEMENT THIS
}