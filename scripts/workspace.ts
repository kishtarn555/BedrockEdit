import { world, Vector3, Dimension } from "@minecraft/server"


const MAX_CHUNK_AREA = 100
const SMALL_WORKSPACE_AREA = 262144;

const LoadedAreas: String[] = []
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
        this.load();
    }

    load() {
        if (!Workspace.validate(this.corner1, this.corner2)) return;
        this.unload();
        LoadedAreas.push(this.identifier);
        this.dimension.runCommand(
            `tickingarea add ${this.corner1.x} ${this.corner1.y} ${this.corner1.z} ${this.corner2.x} ${this.corner2.y} ${this.corner2.z} ${this.identifier}`
        );

    }

    unload() {
        Workspace.unload(this.dimension, this.identifier);
    }
    getVolume() {
        const width = Math.abs(this.corner1.x - this.corner2.x) + 1;
        const height = Math.abs(this.corner1.y - this.corner2.y) + 1;
        const depth = Math.abs(this.corner1.z - this.corner2.z) + 1;
        return width * height * depth;
    }
    isSmallWorkspace() {
        return this.getVolume() <= SMALL_WORKSPACE_AREA;
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

    * allBlocks() {
        let x1 = Math.min(this.corner1.x, this.corner2.x);
        let x2 = Math.max(this.corner1.x, this.corner2.x); 
        let y1 = Math.min(this.corner1.y, this.corner2.y);
        let y2 = Math.max(this.corner1.y, this.corner2.y); 
        let z1 = Math.min(this.corner1.z, this.corner2.z);
        let z2 = Math.max(this.corner1.z, this.corner2.z); 
        for (let i =x1; i<=x2; i++) {
            for (let j=y1; j<=y2; j++) {
                for (let k=z1; k<=z2; k++) {
                    yield {x:i, y:j, z:k};
                }
            }
        }
    }

    static unload(dimension: Dimension, identifier: string) {
        let index = LoadedAreas.indexOf(identifier);
        if (index === -1) {
            return; // This workspace was not loaded bedore
        }
        LoadedAreas.splice(index, 1);

        dimension.runCommand(`tickingarea remove ${identifier}`);
    }

    static getChunkCount(corner1: Vector3, corner2: Vector3) {
        let chunk1 = {
            x: Math.floor(corner1.x / 16),
            z: Math.floor(corner1.z / 16)
        }
        let chunk2 = {
            x: Math.floor(corner2.x / 16),
            z: Math.floor(corner2.z / 16),
        }

        return (Math.abs(chunk1.x - chunk2.x) + 1) * (Math.abs(chunk1.z - chunk2.z) + 1);
    }

    static validate(corner1: Vector3 | undefined, corner2: Vector3 | undefined) {
        if (corner1 == null || corner2 == null) {
            return false;
        }
        return this.getChunkCount(corner1, corner2) <= MAX_CHUNK_AREA;

    }
} 