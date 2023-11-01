import { world, BlockPermutation, CommandError, CommandResult, Dimension, ScriptEventCommandMessageAfterEvent, Vector3 } from "@minecraft/server";
import { BetsCoords } from "../variables";
import { CommandResponse } from "./syntaxHelper";


function fill(dimension: string, blockStatement: string): CommandResponse {
    if (!BetsCoords.arePositionsValid()) {
        return {
            commandStatus: "error",
            message: "Positions are not valid"
        }

    }
    //NOTE: when fillblocks is released, we might want to upgrade to it 
    let result: CommandResult
    try {
        let pos1: Vector3 = BetsCoords.getPos1()!
        let pos2: Vector3 = BetsCoords.getPos2()!
        result = world.getDimension(dimension).runCommand(`fill ${pos1.x} ${pos1.y} ${pos1.z} ${pos2.x} ${pos2.y} ${pos2.z} ${blockStatement}`);
        return {
            commandStatus: "successful",
            message: result.successCount.toString()
        }
    } catch (error) {
        if (error instanceof CommandError) {
            return {
                commandStatus: "noexec",
                message: error.message
            }
        }
    }
    return {
        commandStatus: "error",
        message: "THIS PATH SHOULD NOT BE ACCESSED, CONTACT DEV"
    }


}

function fillScriptEventCommand(event: ScriptEventCommandMessageAfterEvent): CommandResponse {
    let dimension = event.initiator?.dimension ?? event.sourceBlock?.dimension ?? event.sourceEntity?.dimension;
    if (event.message.length === 0) {
        return {
            commandStatus: "error",
            message: "fill command requieres the block"

        }
    }
    return fill(dimension!.id, event.message);
}

export { fillScriptEventCommand }