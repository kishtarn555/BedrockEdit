import { EntityInventoryComponent, ItemStack, Player } from "@minecraft/server";



export class HotBar {
    items: (ItemStack | undefined)[]

    constructor() {
        this.items = []
    }

    loadIntoPlayer(player:Player) {
        for (let i =0;  i < this.items.length; i++){
            const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
            inventory.container.setItem(i, this.items[i]);
        }
    }

    saveFromPlayer(player:Player) {
        this.items = []
        
        for (let i =0;  i < 9; i++){
            const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
            this.items.push(inventory.container.getItem(i)?.clone());
        }
    }
}