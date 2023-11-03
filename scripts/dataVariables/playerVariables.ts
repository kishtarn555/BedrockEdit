
import {BlockPermutation, Player, Vector3} from "@minecraft/server"
import {BetsBlocks, BetsCoords} from "../variables"
class PlayerVariablesConnection {
    player:Player

    constructor(player:Player) {
        this.player = player;
    }

    getCorner1():Vector3|undefined {
        return BetsCoords.getPos1();
    }

    getCorner2():Vector3|undefined {
        return BetsCoords.getPos2();
    }

    

    getBlockPos1():Vector3|undefined {
        return BetsCoords.getBlock1();
    }

    getBlockPos2():Vector3|undefined {
        return BetsCoords.getBlock2();
    }

    getBlock1():BlockPermutation| undefined {
        return BetsBlocks.getBlock1();
    }

    getBlock2():BlockPermutation| undefined {
        return BetsBlocks.getBlock2();
    }

}

