import { Dimension, Vector3 } from "@minecraft/server";


export interface AreaAnchor {
    dimension: Dimension
    location: Vector3
}

export class AreaSelection {
    private mainAnchor: AreaAnchor | undefined;
    private secondaryAnchor: AreaAnchor | undefined;

    constructor() {

    }

    isValid(): boolean {
        if (this.mainAnchor == null || this.secondaryAnchor == null) {
            return false;
        }
        return this.mainAnchor.dimension.id === this.secondaryAnchor.dimension.id;
    }


    getDimension(): Dimension {        
        if (!this.isValid()) {
            throw new Error("Cannot access an invalid selection");
        }
        return this.mainAnchor!.dimension;
    }

    getMainAnchor(): AreaAnchor | undefined {
        return this.mainAnchor;
    }

    setMainAnchor(dimesnion: Dimension, location: Vector3) {
        this.mainAnchor = {
            dimension: dimesnion,
            location: location
        };
    }

    getMainAnchorBlockLocation(): Vector3 | undefined {
        if (this.mainAnchor == null) {
            return undefined;
        }
        return {
            x: Math.floor(this.mainAnchor.location.x),
            y: Math.floor(this.mainAnchor.location.y),
            z: Math.floor(this.mainAnchor.location.z),
        }
    }

    getSecondaryAnchor(): AreaAnchor | undefined {
        return this.secondaryAnchor;
    }

    setSecondaryAnchor(dimension: Dimension, location: Vector3) {
        this.secondaryAnchor = {
            dimension: dimension,
            location: location
        };
    }

    getSecondaryAnchorBlockLocation(): Vector3 | undefined {
        if (this.secondaryAnchor == null) {
            return undefined;
        }
        return {
            x: Math.floor(this.secondaryAnchor.location.x),
            y: Math.floor(this.secondaryAnchor.location.y),
            z: Math.floor(this.secondaryAnchor.location.z),
        };
    }

    getChunkCount():number  {
        if (!this.isValid()) {
            throw new Error("Cannot access an invalid selection");
        }
        let chunk1 = {
            x: Math.floor(this.mainAnchor!.location.x/16),
            z: Math.floor(this.mainAnchor!.location.z/16)
        }
        let chunk2 = {
            x: Math.floor(this.secondaryAnchor!.location.x/16),
            z: Math.floor(this.secondaryAnchor!.location.z/16),
        }

        return (Math.abs(chunk1.x-chunk2.x)+1)*(Math.abs(chunk1.z-chunk2.z)+1);
     }

     clear():void {
        this.mainAnchor = undefined;
        this.secondaryAnchor = undefined;
     }

}