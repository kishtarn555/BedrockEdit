import { Vector3 , ScriptEventCommandMessageAfterEvent, world } from "@minecraft/server"
import { extractCoordsFromLocation, CommandResponse } from "./syntaxHelper";



let coord1:Vector3 | undefined = undefined
let coord2:Vector3 | undefined = undefined

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


function pos1(event:ScriptEventCommandMessageAfterEvent): CommandResponse {
    try {
        coord1= getCoords(event);
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
    return {
        commandStatus:"successful",
        message:`Set pos1 at ${coord1!.x.toFixed(2)} ${coord1!.y.toFixed(2)} ${coord1!.z.toFixed(2)}`
    }
}


function pos2(event:ScriptEventCommandMessageAfterEvent): CommandResponse {
    coord2= getCoords(event);
    return {
        commandStatus:"successful",
        message:`Set pos2 at ${coord2!.x.toFixed(2)} ${coord2!.y.toFixed(2)} ${coord2!.z.toFixed(2)}`
    }
}

function arePositionsValid():boolean {
    return coord1 != null && coord2!= null
}

function getPos1():Vector3 | undefined{
    return coord1;
}
function getPos2():Vector3 | undefined {
    return coord2;
}


function setPos1(location:Vector3) {
    coord1=location;
    world.sendMessage(`Set pos1 at ${coord1!.x.toFixed(2)} ${coord1!.y.toFixed(2)} ${coord1!.z.toFixed(2)}`)
}
function setPos2(location:Vector3) {
    coord2=location;
    world.sendMessage(`Set pos2 at ${coord2!.x.toFixed(2)} ${coord2!.y.toFixed(2)} ${coord2!.z.toFixed(2)}`)

}

export {pos1, pos2,arePositionsValid, getPos1, getPos2, setPos1, setPos2};

