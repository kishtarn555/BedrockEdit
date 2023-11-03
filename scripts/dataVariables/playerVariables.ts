
import {BlockPermutation, Player, Vector3,world} from "@minecraft/server"
import {BetsBlockPlacer, BetsBlocks, BetsCoords} from "../variables"
import BlockPlacer from "../blockPlacer";
import Workspace from "../workspace";
export class PlayerVariablesConnection {
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

    isValidWorkspace() {
        return BetsCoords.isThereAValidWorkspace();
    }

    getWorkspace() {
        if (!this.isValidWorkspace) return;
        return new Workspace(this.getBlockPos1()!, this.getBlockPos2()!, world.getDimension("overworld"), this.player.name)
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

    getBlockPlacer():BlockPlacer {
        return BetsBlockPlacer;
    }

    isBlockPlacerValid():boolean {
        return this.getBlockPlacer().isValid(this.getBlock1(), this.getBlock2());
    }
}

