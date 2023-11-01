import { world, system,BlockPermutation, ItemUseOnBeforeEvent, PlayerBreakBlockBeforeEvent, Dimension, ScriptEventCommandMessageAfterEvent, Vector3 } from "@minecraft/server";
import { BetsBlocks } from "../variables";

let nextPickUse=-1;
const PICK_DELAY=10;

function pickBlock (arg:PlayerBreakBlockBeforeEvent | ItemUseOnBeforeEvent) {
    if (!arg.itemStack?.typeId.startsWith("bets:picker")) {
        return;
    }
    arg.cancel=true;
    if (system.currentTick < nextPickUse ) return;
    nextPickUse = system.currentTick + PICK_DELAY;

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