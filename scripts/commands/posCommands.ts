import { Vector3 , ScriptEventCommandMessageAfterEvent, world } from "@minecraft/server"
import { extractCoordsFromLocation, CommandResponse } from "./syntaxHelper";

import { BetsCoords } from "../variables";


function getCoords(event: ScriptEventCommandMessageAfterEvent) {
    let {
        id,
        initiator,
        sourceEntity,
        sourceBlock,
        message
    } = event;
    let location = initiator?.location ?? sourceEntity?.location ?? sourceBlock?.location;

    if (message.length === 0) {
        return location!;
    } else {
        return extractCoordsFromLocation(location!, message);
    }
}


function pos1ScriptEvent(event:ScriptEventCommandMessageAfterEvent): CommandResponse {
    try {
        BetsCoords.setPos1(getCoords(event));
    } catch(err) {
        if (err instanceof Error) {
            return {
                commandStatus:"error",
                message:err.message
            } 
        }
        return {
            commandStatus:"error",
            message:"unknown error"
        } 
    }
    let coord1 = BetsCoords.getPos1()
    return {
        commandStatus:"successful",
        message:`Set pos1 at ${coord1!.x.toFixed(2)} ${coord1!.y.toFixed(2)} ${coord1!.z.toFixed(2)}`
    }
}


function pos2ScriptEvent(event:ScriptEventCommandMessageAfterEvent): CommandResponse {
    try {
        BetsCoords.setPos2(getCoords(event));
    } catch(err) {
        if (err instanceof Error) {
            return {
                commandStatus:"error",
                message:err.message
            } 
        }
        return {
            commandStatus:"error",
            message:"unknown error"
        } 
    }
    let coord2 = BetsCoords.getPos2()
    return {
        commandStatus:"successful",
        message:`Set pos1 at ${coord2!.x.toFixed(2)} ${coord2!.y.toFixed(2)} ${coord2!.z.toFixed(2)}`
    }
}

export {pos1ScriptEvent, pos2ScriptEvent}

