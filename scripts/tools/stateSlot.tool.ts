import { world, system, BlockPermutation, ItemUseOnBeforeEvent, PlayerBreakBlockBeforeEvent, Dimension, ScriptEventCommandMessageAfterEvent, Vector3, ItemUseBeforeEvent, Player, BlockStates, Block } from "@minecraft/server";
import { getPlayerSession } from "../session/playerSessionRegistry";
import { DebugStickModal } from "../modals/debugStickModal";
import { getBlockFromDirection } from "../blockUtils";
import { db } from "../db/dbStringManager";
import { logDebug, logToPlayer } from "../chat";

let nextPickUse = -1;
const PICK_DELAY = 4;
const FAST_PACE = 0;
let useFastPace = false;

let lastUse:Vector3 = {x:0, y:0, z:0};



function performAction(player:Player, block: Block | undefined, data:string) {
    if (data==="NA") {
        logToPlayer(player, "error", {text:"Failed"} )
        return;
    }
    const obj = JSON.parse(data)
    const permutation = BlockPermutation.resolve( obj.typeId, obj.states )
    
    system.run(
        ()=> {
            block?.setPermutation( permutation )
            player.dimension.playSound("dig.stone", player.location, {
                pitch: Math.random()*0.2+0.8
            })
        }
    );
}

function placeBlock(arg: ItemUseOnBeforeEvent) {
    if (!arg.itemStack?.typeId.startsWith("bets:state_slot")) {
        return;
    }
    
    arg.cancel = true;
    if (system.currentTick < nextPickUse) return;
    if (system.currentTick <= nextPickUse+2) {
        const dx = (lastUse.x - arg.block.location.x) !==0?1:0
        const dy = (lastUse.y - arg.block.location.y) !==0?1:0
        const dz = (lastUse.z - arg.block.location.z) !==0?1:0
        if (dx+dy+dz !== 1) {
            return;
        }
        useFastPace = true;
    } else {
        useFastPace = false;
        lastUse = arg.block.location;
    }
    nextPickUse = system.currentTick + (useFastPace ? FAST_PACE : PICK_DELAY);
    const data = db.loadString("permutation","NA", arg.itemStack)
    const player = arg.source;
    performAction (player, getBlockFromDirection(arg.block, arg.blockFace)!, data)
}


function replaceBlock(arg: PlayerBreakBlockBeforeEvent) {
    if (!arg.itemStack?.typeId.startsWith("bets:state_slot")) {
        return;
    }
    
    arg.cancel = true;
    if (system.currentTick < nextPickUse) return;
    nextPickUse = system.currentTick + PICK_DELAY;
    const data = db.loadString("permutation","NA", arg.itemStack)    
    const player = arg.player;
    performAction (player, arg.block!, data)
}

function attachStateSlotListener() {
    //Fixme Don't repeat yourself
    world.beforeEvents.itemUseOn.subscribe(placeBlock);
    world.beforeEvents.playerBreakBlock.subscribe(replaceBlock);

}

export { attachStateSlotListener }