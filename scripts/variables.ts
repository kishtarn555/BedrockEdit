import { Vector3, BlockPermutation, world } from "@minecraft/server"

let coordinates1:Vector3|undefined
let coordinates2:Vector3|undefined

let block1:BlockPermutation | undefined
let block2:BlockPermutation | undefined

class BetsCoords {

    static setPos1(location:Vector3) {
        coordinates1 = location;
        world.sendMessage(`[§9Bets§f] §bPos1§f set to §a ${coordinates1.x.toFixed(2)} ${coordinates1.y.toFixed(2)} ${coordinates1.z.toFixed(2)} `)
    }
    static setPos2(location:Vector3) {
        coordinates2 = location;
        world.sendMessage(`[§9Bets§f] §bPos2§f set to §a ${coordinates2.x.toFixed(2)} ${coordinates2.y.toFixed(2)} ${coordinates2.z.toFixed(2)} `)
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
        world.sendMessage(`[§9Bets§f] §bBlock1§f set to §a ${block1} `)

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