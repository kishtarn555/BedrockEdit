import { system } from "@minecraft/server";
import { BlockSelection } from "./BlockSelection";
import { AreaSelection } from "./Selection";
import BlockPlacer, { BlockPlacingMode } from "../blockPlacer";
import Workspace from "../workspace";
import { HotBar } from "./hotbar";


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
    private savedHotbars:HotBar[]
    private previousHotBar:HotBar

    constructor(nameTag: string, data?: SessionData) {
        this.nameTag = nameTag;
        this.selection = data?.selection ?? new AreaSelection();
        this.blockSelection = data?.blockSelection ?? new BlockSelection();
        this.blockPlacingMode = data?.blockPlacingMode ?? BlockPlacingMode.normal;
        this.cooldowns = new Map()
        this.savedHotbars = [
            new HotBar(),
            new HotBar(),
            new HotBar(),
            new HotBar(),
            new HotBar(),
            new HotBar(),
            new HotBar(),
            new HotBar(),
            new HotBar(),
        ];
        this.previousHotBar = new HotBar();

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
            this.selection.getMainAnchorBlockLocation()!,
            this.selection.getSecondaryAnchorBlockLocation()!,
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
            return true;
        }
        return this.cooldowns.get(key)! <= system.currentTick ;
    }

    setCooldown(key:string) {
        this.cooldowns.set(key, system.currentTick+10);
    }

    getHotBar(slot:number) {
        return this.savedHotbars[slot];
    }


    getPreviousHotBar() {
        return this.previousHotBar;
    }
    

    
    

}