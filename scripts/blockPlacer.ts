import { Block, BlockPermutation } from "@minecraft/server";

export default class BlockPlacer {
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

    }


}



export enum BlockPlacingMode {
    normal = 0, //Places blocks normally, independent of what replaces
    keep = 1, //Only replaces air blocks
    replaceExactly = 2,
    replaceLoosely = 3// IMPLEMENT THIS
}