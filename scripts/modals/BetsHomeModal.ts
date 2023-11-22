import { Player } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"
import { HotBar } from "./hotbarNav/hotbar"


export class BetsHomeModal {
    private modal: ActionFormData

    constructor() {
        this.modal =
            new ActionFormData()
                .title({
                    translate: "bets.modal.home.title"
                })
                .button(
                    { translate: "bets.modal.home.hot_bar" },
                    "textures/items/bets/bets_menu.png"
                )
                .button(
                    {translate: "bets.modal.home.panic"},
                    "textures/ui/ErrorGlyph.png"
                )
                .button(
                    { translate: "bets.modal.home.preferences" },                    
                    "textures/items/bets/player_config.png"
                )

    }



    show(player: Player) {
        this.modal.show(player).then(
            response => {
                if (response.canceled) {
                    return;
                }


            }
        );
    }





}