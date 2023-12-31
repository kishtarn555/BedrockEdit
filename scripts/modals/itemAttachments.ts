import { world, system } from "@minecraft/server"
import BlockPlacingModeSelectionModal from "./BlockPlacingModeModal";
import { BetsHomeModal } from "./BetsHomeModal";
export default function attachModalItemUseListeners() {
    world.beforeEvents.itemUse.subscribe((args) => {
        if (!args.itemStack.typeId.startsWith("bets:menu")) return;
        args.cancel = true;
        system.run(() => {
            switch (args.itemStack.typeId) {
                case "bets:menu_block_mode":
                    new BlockPlacingModeSelectionModal().show(args.source);
                    break;
                case "bets:menu":
                    new BetsHomeModal().show(args.source)
                    break;
            }
        });
    });
}