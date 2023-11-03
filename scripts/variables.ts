import { Vector3, BlockPermutation, world } from "@minecraft/server"
import BlockPlacer from "./blockPlacer"

let coordinates1:Vector3|undefined
let coordinates2:Vector3|undefined

let block1:BlockPermutation | undefined
let block2:BlockPermutation | undefined

const MAX_CHUNK_AREA = 100
const BetsBlockPlacer:BlockPlacer = new BlockPlacer()
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

    static getBlock1() :Vector3 | undefined{
        if (coordinates1 == null) return;
        return {
            x:Math.floor(coordinates1.x),
            y:Math.floor(coordinates1.y),
            z:Math.floor(coordinates1.z)
        }
    }

    static getBlock2() :Vector3 | undefined{
        if (coordinates2 == null) return;
        return {
            x:Math.floor(coordinates2.x),
            y:Math.floor(coordinates2.y),
            z:Math.floor(coordinates2.z)
        }
    }

    static arePositionsValid() {
        return coordinates1 != null && coordinates2 != null;
    }

    static getBlockBoundsLength() {
        if (!this.arePositionsValid()) {
            return;
        }
        let v1 = this.getBlock1()!
        let v2 = this.getBlock2()!
        let xs = v1.x !== v2.x?2:1;  
        let ys = v1.y !== v2.y?2:1;  
        let zs = v1.z !== v2.z?2:1;
        let length = (
            (Math.abs(v1.x-v2.x)*ys*zs) +
            (Math.abs(v1.y-v2.y)*xs*zs) +
            (Math.abs(v1.z-v2.z)*xs*ys )
        ); 
        
        length += xs*ys*zs;  
        return length;
    }

    static getChunkCount() {
        if (!this.arePositionsValid()) {
            return;
        }

        let pos1 = this.getBlock1()!
        let pos2 = this.getBlock2()!

        let chunk1 = {
            x: Math.floor(pos1.x/16),
            z: Math.floor(pos1.z/16)
        }
        let chunk2 = {
            x: Math.floor(pos2.x/16),
            z: Math.floor(pos2.z/16),
        }

        return (Math.abs(chunk1.x-chunk2.x)+1)*(Math.abs(chunk1.z-chunk2.z)+1);
    }

    
    static isThereAValidWorkspace():boolean {
        let chunkArea = this.getChunkCount();
        if (chunkArea == null) {
            return false;
        }
        return chunkArea <= MAX_CHUNK_AREA

    }
}


class BetsBlocks {

    static setBlock1(block:BlockPermutation) {
        block1 = block;
        world.sendMessage(`[§9Bets§f] §bBlock1§f set to §a ${block1} `)

    }

    static setBlock2(block:BlockPermutation) {
        block2 = block;
        world.sendMessage(`[§9Bets§f] §bBlock2§f set to §a ${block2} `)
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


export { BetsCoords, BetsBlocks, BetsBlockPlacer, MAX_WORKSPACE_PERIMETER }