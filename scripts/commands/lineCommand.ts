import { world, BlockPermutation, CommandError, CommandResult, Dimension, ScriptEventCommandMessageAfterEvent, Vector3 } from "@minecraft/server";
import { BetsCoords } from "../variables";
import { CommandResponse } from "./syntaxHelper";

import { plot3D } from "../BresenhamLine";


function line(dimension: string, blockStatement: string): CommandResponse {
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

        let points = plot3D(
            Math.floor(pos1.x),
            Math.floor(pos1.y),
            Math.floor(pos1.z),
            Math.floor(pos2.x),
            Math.floor(pos2.y),
            Math.floor(pos2.z),
        )

        //NOTE: This might need a bump after fillBlocks is added
        for (const point of points) {
            world.getDimension(dimension).runCommand(`setblock ${point.x} ${point.y} ${point.z} ${blockStatement}`);
        }
        return {
            commandStatus: "successful",
            message: [Math.floor(pos1.x),
                Math.floor(pos1.y),
                Math.floor(pos1.z),
                Math.floor(pos2.x),
                Math.floor(pos2.y),
                Math.floor(pos2.z)].join(",")
        }
        
    } catch (error) {
        if (error instanceof CommandError) {
            return {
                commandStatus: "noexec",
                message: error.message
            }
        }
        // @ts-ignore
        world.sendMessage(error.message) 
    }
    return {
        commandStatus: "error",
        message: "THIS PATH SHOULD NOT BE ACCESSED, CONTACT DEV"
    }


}

function lineScriptEventCommand(event: ScriptEventCommandMessageAfterEvent): CommandResponse {
    let dimension = event.initiator?.dimension ?? event.sourceBlock?.dimension ?? event.sourceEntity?.dimension;
    if (event.message.length === 0) {
        return {
            commandStatus: "error",
            message: "fill command requieres the block"

        }
    }
    return line(dimension!.id, event.message);
}

export { lineScriptEventCommand }