import { Vector3 } from "@minecraft/server"

let coordinates1:Vector3|undefined
let coordinates2:Vector3|undefined

class BetsCoords {

    static setPos1(location:Vector3) {
        coordinates1 = location;
    }
    static setPos2(location:Vector3) {
        coordinates2 = location;
    }

    
    static getPos1() {
        return coordinates1;
    }
    static getPos2() {
        return coordinates2
    }

    static arePositionsValid() {
        return coordinates1 != null && coordinates2 != null;
    }
}


export { BetsCoords }