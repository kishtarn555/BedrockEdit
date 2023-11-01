import {world, ScriptEventCommandMessageAfterEvent, Player, system, Direction, Vector3} from "@minecraft/server"
import { BetsCoords } from "../variables";
import { CommandResponse } from "../commands/syntaxHelper";

 
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
        let location = arg.block.location;
        let offset = GetDirectionOffset(arg.blockFace);
        offset = {
            x:location.x + offset.x,
            y:location.y + offset.y,
            z:location.z + offset.z
        }
        if (arg.itemStack?.typeId==="bets:wand_red") {
            BetsCoords.setPos2(offset);
        } else if (arg.itemStack?.typeId==="bets:wand_blue") {
            BetsCoords.setPos1(offset);
        }  else {        
            BetsCoords.setPos2(location)
        }
    });

    
    world.beforeEvents.itemUse.subscribe((arg)=> {
        if (!arg.itemStack?.typeId.startsWith("bets:wand")) {
            return;
        }
               
        arg.cancel = true;
        if (system.currentTick < wandNextUse) return;
        wandNextUse = system.currentTick+WAND_COOLDOWN;
        let location = arg.source.location;
        
        if (arg.itemStack?.typeId==="bets:wand_red") {
            BetsCoords.setPos2(location);
        } else if (arg.itemStack?.typeId==="bets:wand_blue") {
            BetsCoords.setPos1(location);
        }
    });

    world.beforeEvents.playerBreakBlock.subscribe((arg)=> {
        if (!arg.itemStack?.typeId.startsWith("bets:wand")) {
            return;
        }
        
        arg.cancel = true;
        if (system.currentTick < wandNextBreak) return;
        wandNextBreak = system.currentTick+WAND_COOLDOWN;
        if (arg.itemStack?.typeId==="bets:wand" || arg.itemStack?.typeId==="bets:wand_blue") {
            BetsCoords.setPos1(arg.block.location)
        } else if (arg.itemStack?.typeId==="bets:wand_red") {
            BetsCoords.setPos2(arg.block.location)
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