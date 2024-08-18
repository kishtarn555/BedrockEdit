import { EntityComponentTypes, EntityInventoryComponent, ItemStack, Player, Vector3, system } from "@minecraft/server";
import { Command, CommandArgType, CommandArgsLiteral, CommandOptions, CommandOutput } from "./commands";
import { getPlayerSession } from "../session/playerSessionRegistry";
import { db } from "../db/dbStringManager";
import { logDebug } from "../chat";

const SetStateStotMan = "commands.set_state_slot.man";

const COMMAND_OPTIONS:CommandOptions =  {
}

function setDynamicProperties(player:Player) : CommandOutput {
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
        message:{text:"commands.set_state_slot.success"}
    }

    
}

async function set_state_slot_Exec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    
    const result = setDynamicProperties(player)
    if (result.status==="success") {
        return {
            status:"success",
            message: {translate:"commands.set_state_slot.success"}
        }
    }  else {
        return result;
    }
}


async function get_state_slot_exec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    const slot = player.selectedSlotIndex;
    const inventory = player.getComponent(EntityComponentTypes.Inventory ) as EntityInventoryComponent
    const item =inventory.container?.getSlot(slot);
    const r = system.currentTick%3+1; //Fake random
    item?.setItem(new ItemStack(`bets:state_slot_${r}`))
    const result = setDynamicProperties(player)
    if (result.status==="success") {
        return {
            status:"success",
            message: {translate:"commands.set_state_slot.success"}
        }
    }  else {
        return result;
    }
}


export const BST_COMMAND:Command = new Command(
    "bst",
    SetStateStotMan,
    set_state_slot_Exec,
    COMMAND_OPTIONS
)





export const GETS_COMMAND:Command = new Command(
    "gets",
    SetStateStotMan,
    get_state_slot_exec,
    COMMAND_OPTIONS
)
