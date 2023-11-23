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


    getDimension(): Dimension | undefined {
        if (!this.isValid()) {
            return undefined;
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
            x: Math.abs(this.mainAnchor.location.x),
            y: Math.abs(this.mainAnchor.location.y),
            z: Math.abs(this.mainAnchor.location.z),
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
            x: Math.abs(this.secondaryAnchor.location.x),
            y: Math.abs(this.secondaryAnchor.location.y),
            z: Math.abs(this.secondaryAnchor.location.z),
        };
    }

}