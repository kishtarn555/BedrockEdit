import { EntityComponentTypes, EntityInventoryComponent, Player, Vector3 } from "@minecraft/server";
import { Command, CommandArgType, CommandArgsLiteral, CommandOptions, CommandOutput } from "./commands";
import { getPlayerSession } from "../session/playerSessionRegistry";
import { db } from "../db/dbStringManager";
import { logDebug } from "../chat";

const SetStateStotMan = "commands.set_state_slot.man";

const COMMAND_OPTIONS:CommandOptions =  {
}

async function set_state_slot_Exec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    const slot = player.selectedSlotIndex;
    const inventory = player.getComponent(EntityComponentTypes.Inventory ) as EntityInventoryComponent
    const item =inventory.container?.getSlot(slot);
    const session = getPlayerSession(player.nameTag);
    const permutation = session.blockSelection.mainBlockPermutation
    if (item == null) {
        return {
            status:"runtimeError",
            message: {translate:"commands.set_state_slot.incorrectItem"}
        }
    }
    if (!(item.typeId.startsWith("bets:state_slot"))) {
        return {
            status:"runtimeError",
            message: {translate:"commands.set_state_slot.incorrectItem"}
        }
    }
    if (permutation==null) {        
        return {
            status:"runtimeError",
            message: {translate:"commands.set_state_slot.noSel"}
        }
    }

    const data = {
        typeId: permutation.type.id,
        states: permutation.getAllStates()
    }
    
    db.saveString("permutation", JSON.stringify(data), item);
    item.setDynamicProperty("permutation", JSON.stringify(data));
    item.nameTag = permutation.type.id;
    let lore = []
    let keys  = Object.keys(data.states)
    for (let k of keys) {
        lore.push(`${k}:${data.states[k]}`)
    }
    item.setLore(lore);

    
    
    return {
        status:"success",
        message: {translate:"commands.set_state_slot.success"}
    }


}




export const BST_COMMAND:Command = new Command(
    "bst",
    SetStateStotMan,
    set_state_slot_Exec,
    COMMAND_OPTIONS
)
