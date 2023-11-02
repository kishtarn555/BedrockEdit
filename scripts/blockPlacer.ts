import { Block, BlockPermutation } from "@minecraft/server";
import { BetsBlocks } from "./variables";

export default class BlockPlacer {
    operationType:BlockPlacingType = BlockPlacingType.replaceExaclty


    setBlockPermutation(block:Block, primary:BlockPermutation, secondary?:BlockPermutation) {
        switch (this.operationType) {
            case BlockPlacingType.normal:
                block.setPermutation(primary);
                break;
            case BlockPlacingType.keep:
                if (block.isAir) {                    
                    block.setPermutation(primary);
                }
                break;
            case BlockPlacingType.replaceExaclty:
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



enum BlockPlacingType {
    normal, //Places blocks normally, independent of what replaces
    keep, //Only replaces air blocks
    replaceExaclty,
    replaceLoosly// IMPLEMENT THIS



}