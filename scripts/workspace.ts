import {world, Vector3, Dimension} from "@minecraft/server"



export default class Workspace {
    corner1: Vector3
    corner2: Vector3
    dimension:Dimension
    identifier:string

    constructor (corner1:Vector3, corner2: Vector3, dimension:Dimension, identifier:string) {
        this.corner1 = corner1
        this.corner2 = corner2
        this.dimension = dimension
        this.identifier = identifier
    }

    load() {
        this.dimension.runCommand(`tickingarea add ${this.corner1.x} ${this.corner1.y} ${this.corner1.z} ${this.corner2.x} ${this.corner2.y} ${this.corner2.z} bets_${this.identifier}`)

    }

    unload() {
        this.dimension.runCommand(`tickingarea remove bets_wsp_${this.identifier}`);
    }


    isInBound(location:Vector3) {
        if (location.x < Math.min(this.corner1.x,this.corner2.x) || location.x > Math.max(this.corner1.x,this.corner2.x)) {
            return false;
        }
        if (location.y < Math.min(this.corner1.y,this.corner2.y) || location.y > Math.max(this.corner1.y,this.corner2.y)) {
            return false;
        }
        if (location.z < Math.min(this.corner1.z,this.corner2.z) || location.z > Math.max(this.corner1.z,this.corner2.z)) {
            return false;
        }
        return true;
    }
    static unload(dimension:Dimension,identifier:string) {
        dimension.runCommand(`tickingarea remove bets_wsp${identifier}`);
    }
} 