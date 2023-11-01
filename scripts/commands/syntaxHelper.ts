
import { Vector3, Entity } from "@minecraft/server"

function extractCoordsFromLocation(location:Vector3, scoords:string):Vector3 {
    const parts: string[] = scoords.trim().split(/\s+/);
    if (parts.length < 3){
        throw new Error("Coordinates provided are not properly formatted")
    }

    let response:number[] = [location.x,location.y,location.z]
    //TODO: Support local coordinates
    for (let i =0; i < 3; i++) {
        if (parts[i][0]==='~') {
            let delta = 0;
            if (parts[i] !== "~") {
                delta = parseFloat(parts[i].substring(1));
            }
            response[i]+=delta
            continue;
        } 
        response[i] = parseFloat(parts[i]);
    }

    return {
        x:response[0],
        y:response[1],
        z:response[2]
    }

}

interface CommandResponse {
    commandStatus: "error" | "successful" | "noexec" | "warning"
    message: string
}

export {extractCoordsFromLocation, CommandResponse}