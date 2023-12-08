import { EntityInventoryComponent, ItemStack, Player } from "@minecraft/server";



export class HotBar {
    items: (ItemStack | undefined)[]
    readonly isReadonly:boolean;
    constructor(isReadonly:boolean=false, items?:(ItemStack|undefined)[]) {
        this.items = items ?? []
        this.isReadonly = isReadonly;
    }

    loadIntoPlayer(player:Player) {
        for (let i =0;  i < this.items.length; i++){
            const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
            inventory.container!.setItem(i, this.items[i]); //FIXME: Why can inventory.container be undefined?
        }
    }

    saveFromPlayer(player:Player) {
        if (this.isReadonly) {
            throw new Error("Cannot save a read-only hotbar");
        }
        this.items = []
        
        for (let i =0;  i < 9; i++){
            const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
            this.items.push(inventory.container!.getItem(i)?.clone()); //FIXME: Why can inventory.container be undefined?
        }
    }
}