import { Player } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"

export class BetsHomeModal {
    private modal:ActionFormData

    constructor () {
        this.modal = 
            new ActionFormData()
                .title({
                    translate:"bets.modal.home.title"
                })
                .button({
                    translate:"bets.modal.home.hot_bar.nav"
                },
                "textures/items/bets/bets_menu.png"
                )
            
    }



    show(player:Player) {
        this.modal.show(player).then(
            response=> {
                if (response.canceled) {
                    return;
                }
            }
        );
    }



    

}