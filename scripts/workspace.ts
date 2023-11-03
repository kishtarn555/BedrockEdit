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

    static unload(dimension:Dimension,identifier:string) {
        dimension.runCommand(`tickingarea remove bets_wsp${identifier}`);
    }
} 