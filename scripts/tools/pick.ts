import { world, system, BlockPermutation, ItemUseOnBeforeEvent, PlayerBreakBlockBeforeEvent, Dimension, ScriptEventCommandMessageAfterEvent, Vector3, ItemUseBeforeEvent, Player } from "@minecraft/server";
import { getPlayerSession } from "../session/playerSessionRegistry";

let nextPickUse = -1;
const PICK_DELAY = 10;

function pickBlock(arg: PlayerBreakBlockBeforeEvent | ItemUseOnBeforeEvent) {
    if (!arg.itemStack?.typeId.startsWith("bets:picker")) {
        return;
    }
    arg.cancel = true;
    if (system.currentTick < nextPickUse) return;
    nextPickUse = system.currentTick + PICK_DELAY;
    const player = arg instanceof PlayerBreakBlockBeforeEvent ? arg.player : arg.source;
    const session = getPlayerSession(player.name);

    if (arg.itemStack?.typeId === "bets:picker_blue") {
        setMessage(player, "a block", true);
        session.blockSelection.mainBlockPermutation = arg.block.permutation;
        return;
    }
    if (arg.itemStack?.typeId === "bets:picker_red") {
        setMessage(player, "a block", false);
        session.blockSelection.secondaryBlockPermutation = arg.block.permutation;
        return;
    }
}


function setMessage(player:Player, block:string,mainBlock:boolean=true) {
    const selection = mainBlock?"Main":"Secondary";
    player.sendMessage({
        rawtext:[
            {text:"[§9Bets§f] "},
            {text:`§6${selection} block§r set to ${block}`}
        ]
    });
}

function pickAir(arg: ItemUseBeforeEvent) {
    if (!arg.itemStack?.typeId.startsWith("bets:picker")) {
        return;
    }
    arg.cancel = true;
    const player = arg.source;
    const session = getPlayerSession(player.name);
    if (system.currentTick < nextPickUse) return;
    nextPickUse = system.currentTick + PICK_DELAY;
    if (arg.itemStack?.typeId === "bets:picker_blue") {
        setMessage(player, "air", true);
        session.blockSelection.mainBlockPermutation = BlockPermutation.resolve("minecraft:air");
        return;
    }
    if (arg.itemStack?.typeId === "bets:picker_red") {
        setMessage(player, "air", false);
        session.blockSelection.secondaryBlockPermutation = BlockPermutation.resolve("minecraft:air");
        return;
    }
}

function attachPickerItemUse() {
    //Fixme Don't repeat yourself
    world.beforeEvents.itemUseOn.subscribe(pickBlock);
    world.beforeEvents.playerBreakBlock.subscribe(pickBlock);

    world.beforeEvents.itemUse.subscribe(pickAir);
}

export { attachPickerItemUse }