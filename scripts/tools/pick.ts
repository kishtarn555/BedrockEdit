import { world, BlockPermutation, ItemUseOnBeforeEvent, PlayerBreakBlockBeforeEvent, Dimension, ScriptEventCommandMessageAfterEvent, Vector3 } from "@minecraft/server";
import { BetsBlocks } from "../variables";

function pickBlock (arg:PlayerBreakBlockBeforeEvent | ItemUseOnBeforeEvent) {
    if (!arg.itemStack?.typeId.startsWith("bets:picker")) {
        return;
    }
    arg.cancel=true;

    if (arg.itemStack?.typeId==="bets:picker_blue") {
        BetsBlocks.setBlock1(arg.block.permutation);
        return;
    }
    if (arg.itemStack?.typeId==="bets:picker_red") {
        BetsBlocks.setBlock2(arg.block.permutation);
        return;
    }
}

function attachPickerItemUse() {
    //Fixme Don't repeat yourself
    world.beforeEvents.itemUseOn.subscribe(pickBlock);
    world.beforeEvents.playerBreakBlock.subscribe(pickBlock);
}

export { attachPickerItemUse }