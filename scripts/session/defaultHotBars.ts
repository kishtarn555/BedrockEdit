import { ItemLockMode, ItemStack } from "@minecraft/server";
import { HotBar } from "./hotbar";

export function getBetsToolHotBar() { 
    const menu = new ItemStack("bets:menu");
    const blueWand = new ItemStack("bets:wand_blue");
    const redWand = new ItemStack("bets:wand_red");
    const bluePicker = new ItemStack("bets:picker_blue");
    const redPicker = new ItemStack("bets:picker_red");
    const undoOperator = new ItemStack("bets:operator_undo");
    const redoOperator = new ItemStack("bets:operator_redo");
    return new HotBar(true, [
        menu,
        blueWand,
        redWand,
        bluePicker,
        redPicker,
        undefined,
        undefined,
        undoOperator,
        redoOperator,
    ]);
}
