import { Block, BlockPermutation } from "@minecraft/server";
import { Commit } from "./commits/commit";
import { BlockSelection } from "./session/BlockSelection";
export default class BlockPlacer {
    readonly selection:BlockSelection
    readonly operationMode:BlockPlacingMode;

    constructor (selection:BlockSelection, operatioNMode:BlockPlacingMode) {
        this.selection = selection;
        this.operationMode = operatioNMode;
    }
    
    isValid() {
        return BlockPlacer.validateSelection(this.selection, this.operationMode);
    }

    private setBlockPermutation(block:Block) {
        const primary = this.selection.mainBlockPermutation;
        const secondary = this.selection.secondaryBlockPermutation;
        if (primary == null) {
            throw new Error ("Primary block is not set");
        }
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

    placeBlock(block: Block, commit?:Commit)  :number{
        if (!block.isValid()) return 0;
        let previousState = block.permutation
        let nextState = this.setBlockPermutation(block);
        if (nextState!==previousState) {
            commit?.saveChange(block.dimension,block.location, previousState, nextState);
            return 1;
        }
        return 0;
    }


    static validateSelection(selection:BlockSelection, operationMode:BlockPlacingMode) :boolean{
        const primary = selection.mainBlockPermutation;
        const secondary = selection.secondaryBlockPermutation;
        if (primary ==null) {
            return false;
        }
        if (operationMode === BlockPlacingMode.normal || operationMode === BlockPlacingMode.keep) {
            return true;
        }
        if (secondary == null) {
            return false;
        }
        return true;
    }


}



export enum BlockPlacingMode {
    normal = 0, //Places blocks normally, independent of what replaces
    keep = 1, //Only replaces air blocks
    replaceExactly = 2,
    replaceLoosely = 3// IMPLEMENT THIS
}