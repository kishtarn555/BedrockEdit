import { Block, system } from "@minecraft/server";
import { BlockSelection } from "./BlockSelection";
import { AreaSelection } from "./Selection";
import BlockPlacer, { BlockPlacingMode } from "../blockPlacer";
import Workspace from "../workspace";


export interface SessionData {
    selection: AreaSelection
    blockSelection: BlockSelection | undefined
    blockPlacingMode: BlockPlacingMode | undefined
}

export class PlayerSession {
    nameTag: string
    selection: AreaSelection
    blockSelection: BlockSelection
    blockPlacingMode: BlockPlacingMode

    private cooldowns:Map<string, number>


    constructor(nameTag: string, data?: SessionData) {
        this.nameTag = nameTag;
        this.selection = data?.selection ?? new AreaSelection();
        this.blockSelection = data?.blockSelection ?? new BlockSelection();
        this.blockPlacingMode = data?.blockPlacingMode ?? BlockPlacingMode.normal;
        this.cooldowns = new Map()

    }


    hasValidWorkspace():boolean {
        if (!this.selection.isValid()) {
            return false;
        }
        return (this.selection.getChunkCount() <= Workspace.getMaxChunkArea());
    }



    getWorkspace(): Workspace | undefined {
        if (!this.selection.isValid()) {
            return undefined;
        }
        const response = new Workspace(
            this.selection.getMainAnchor()!.location,
            this.selection.getSecondaryAnchor()!.location,
            this.selection.getDimension()!,
            this.nameTag + "_workspace"
        );
        if (!response.isAreaValid()) {
            return undefined;
        }
        return response;
    }


    getBlockPlacer() {
        return new BlockPlacer(this.blockSelection, this.blockPlacingMode);
    }

    checkCooldown(key:string):boolean {
        if (!this.cooldowns.has(key)) {
            return false;
        }
        return this.cooldowns.get(key)! <= system.currentTick ;
    }

    setCooldown(key:string) {
        this.cooldowns.set(key, system.currentTick+10);
    }

    

}