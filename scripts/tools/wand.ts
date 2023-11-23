import {world, ScriptEventCommandMessageAfterEvent, Player, system, Direction, Vector3} from "@minecraft/server"
import { BetsCoords } from "../variables";
import { CommandResponse } from "../commands/syntaxHelper";
import { getPlayerSession } from "../session/playerSessionRegistry";

 
let wandNextUse = -1
let wandNextBreak = -1
const WAND_COOLDOWN = 10

function GetDirectionOffset(direction:Direction) :Vector3 {
    switch (direction) {
        case Direction.Up:
            return {x:0,y:1,z:0}; break;
        case Direction.Down:            
            return {x:0,y:-1,z:0}; break;
        case Direction.East:            
            return {x:1,y:0,z:0}; break;
        case Direction.West:            
            return {x:-1,y:0,z:0}; break;
        case Direction.North:            
            return {x:0,y:0,z:-1}; break;
        case Direction.South:            
            return {x:0,y:0,z:1}; break;
    }
}

function attachWandListener() {

    world.beforeEvents.itemUseOn.subscribe((arg)=> {
        if (!arg.itemStack?.typeId.startsWith("bets:wand")) {
            return;
        }
               
        arg.cancel = true;
        if (system.currentTick < wandNextUse) return;
        wandNextUse = system.currentTick+WAND_COOLDOWN;
        const selection = getPlayerSession(arg.source.name).selection;
        const dimension = arg.source.dimension;
        let location = arg.block.location;
        let offset = GetDirectionOffset(arg.blockFace);
        offset = {
            x:location.x + offset.x,
            y:location.y + offset.y,
            z:location.z + offset.z
        }
        if (arg.itemStack?.typeId==="bets:wand_red") {
            selection.setSecondaryAnchor(dimension, offset);
        } else if (arg.itemStack?.typeId==="bets:wand_blue") {
            selection.setMainAnchor(dimension,offset);
        }  else {        
            selection.setSecondaryAnchor(dimension, location)
        }
    });

    
    world.beforeEvents.itemUse.subscribe((arg)=> {
        if (!arg.itemStack?.typeId.startsWith("bets:wand")) {
            return;
        }
        const selection = getPlayerSession(arg.source.name).selection;
        const dimension = arg.source.dimension;

        arg.cancel = true;
        if (system.currentTick < wandNextUse) return;
        wandNextUse = system.currentTick+WAND_COOLDOWN;
        let location = arg.source.location;
        
        if (arg.itemStack?.typeId==="bets:wand_red") {
            selection.setSecondaryAnchor(dimension,location);
        } else if (arg.itemStack?.typeId==="bets:wand_blue") {
            selection.setMainAnchor(dimension,location);
        }
    });

    world.beforeEvents.playerBreakBlock.subscribe((arg)=> {
        if (!arg.itemStack?.typeId.startsWith("bets:wand")) {
            return;
        }
        const selection = getPlayerSession(arg.player.name).selection;
        const dimension = arg.player.dimension;
        const location = arg.block.location;
        arg.cancel = true;
        if (system.currentTick < wandNextBreak) return;
        wandNextBreak = system.currentTick+WAND_COOLDOWN;
        if (arg.itemStack?.typeId==="bets:wand" || arg.itemStack?.typeId==="bets:wand_blue") {
            selection.setMainAnchor(dimension, location)
        } else if (arg.itemStack?.typeId==="bets:wand_red") {
            selection.setSecondaryAnchor(dimension, location)
        }
    });

}


function giveWandScriptEvent(event:ScriptEventCommandMessageAfterEvent) : CommandResponse{
    if (event.sourceEntity == null) {
        return {
            commandStatus:"error",
            message: "A wand can only be given to the player"
        };
    }
    if (!(event.sourceEntity instanceof Player)) {
        return {
            commandStatus:"error",
            message: "A wand can only be given to the player"
        };
    }
    let player = event.sourceEntity as Player;
    try {
        let count = player.runCommand("give @s bets:wand").successCount
        return {
            commandStatus: count === 1? "successful":"noexec",
            message: count === 1? "gave wand":"failed to give wand"
        }
    } finally {
        return {
            commandStatus: "error",
            message: "Error giving wand"
        }
    }
    


}

export {attachWandListener}