import { world, Vector3, Dimension } from "@minecraft/server"


export default class Workspace {
    corner1: Vector3
    corner2: Vector3
    dimension: Dimension
    identifier: string
    
    constructor(corner1: Vector3, corner2: Vector3, dimension: Dimension, identifier: string) {
        this.corner1 = corner1
        this.corner2 = corner2
        this.dimension = dimension
        this.identifier = identifier
    }
    
    getChunkCount() {
        let chunk1 = {
            x: Math.floor(this.corner1.x/16),
            z: Math.floor(this.corner1.z/16)
        }
        let chunk2 = {
            x: Math.floor(this.corner2.x/16),
            z: Math.floor(this.corner2.z/16),
        }
        
        return (Math.abs(chunk1.x-chunk2.x)+1)*(Math.abs(chunk1.z-chunk2.z)+1);
    }
    
    isAreaValid() {        
        return this.getChunkCount() <= Workspace.MAX_CHUNK_AREA
    }
    
    load() {
        this.dimension.runCommand(`tickingarea add ${this.corner1.x} ${this.corner1.y} ${this.corner1.z} ${this.corner2.x} ${this.corner2.y} ${this.corner2.z} bets_wsp_${this.identifier}`)
        
    }
    
    unload() {
        this.dimension.runCommand(`tickingarea remove bets_wsp_${this.identifier}`);
    }
    
    
    isInBound(location: Vector3) {
        if (location.x < Math.min(this.corner1.x, this.corner2.x) || location.x > Math.max(this.corner1.x, this.corner2.x)) {
            return false;
        }
        if (location.y < Math.min(this.corner1.y, this.corner2.y) || location.y > Math.max(this.corner1.y, this.corner2.y)) {
            return false;
        }
        if (location.z < Math.min(this.corner1.z, this.corner2.z) || location.z > Math.max(this.corner1.z, this.corner2.z)) {
            return false;
        }
        return true;
    }
    
    getDimensions() {
        return {
            x:Math.abs(this.corner1.x-this.corner2.x),
            y:Math.abs(this.corner1.y-this.corner2.y),
            z:Math.abs(this.corner1.z-this.corner2.z),
        }
    }

    getVolume() {
        const x1 = Math.min(this.corner1.x, this.corner2.x);
        const y1 = Math.min(this.corner1.y, this.corner2.y);
        const z1 = Math.min(this.corner1.z, this.corner2.z);
        const x2 = Math.max(this.corner1.x, this.corner2.x);
        const y2 = Math.max(this.corner1.y, this.corner2.y);
        const z2 = Math.max(this.corner1.z, this.corner2.z);
        return (x2-x1+1)*(y2-y1+1)*(z2-z1+1);
    }
    
    * iterable() {
        const x1 = Math.min(this.corner1.x, this.corner2.x);
        const y1 = Math.min(this.corner1.y, this.corner2.y);
        const z1 = Math.min(this.corner1.z, this.corner2.z);
        const x2 = Math.max(this.corner1.x, this.corner2.x);
        const y2 = Math.max(this.corner1.y, this.corner2.y);
        const z2 = Math.max(this.corner1.z, this.corner2.z);
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                for (let z = z1; z <= z2; z++) {
                    yield { x: x, y: y, z: z }
                }
            }
        }
    }
    private static MAX_CHUNK_AREA = 100

    static getMaxChunkArea() {
        return this.MAX_CHUNK_AREA;
    }
    
    static unload(dimension: Dimension, identifier: string) {
        dimension.runCommand(`tickingarea remove bets_wsp${identifier}`);
    }
} 