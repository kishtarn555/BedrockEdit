import { Vector3, BlockPermutation } from "@minecraft/server"

let coordinates1:Vector3|undefined
let coordinates2:Vector3|undefined

let block1:BlockPermutation | undefined
let block2:BlockPermutation | undefined

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


class BetsBlocks {

    static setBlock1(block:BlockPermutation) {
        block1 = block;
    }

    static setBlock2(block:BlockPermutation) {
        block2 = block;
    }
    
    static getBlock1() {
        return block1
    }

    
    static getBlock2() {
        return block2
    }

    static isBlock1Valid() {
        return block1 != null ;
    }

    static isBlock2Valid() {
        return block2 != null;
    }
}


export { BetsCoords, BetsBlocks }