import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { HotBar } from "../../session/hotbar";
import { getBetsToolHotBar } from "../../session/defaultHotBars";
import { getPlayerSession } from "../../session/playerSessionRegistry";

export class SelectHotBarModal {
    readonly player: Player
    readonly modal: ModalFormData

    constructor(player:Player) {
        this.player = player;
        this.modal = new ModalFormData()
            .title(
                { translate: "bets.modal.hot_bar.title" }
            )
            .dropdown(
                { translate: "bets.modal.hot_bar.select" },
                [
                    { translate: "bets.modal.hot_bar.tools" },
                    { translate: "bets.modal.hot_bar.previous" },
                    { translate: "bets.modal.hot_bar.quick_load", with:["0"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["1"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["2"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["3"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["4"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["5"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["6"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["7"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["8"] },
                    { translate: "bets.modal.hot_bar.quick_load", with:["9"] },
                ]
            )
            .toggle(
                { translate: "bets.modal.hot_bar.save" }, 
                false
            )
    }


    show() {
        this.modal.show(this.player).then(response=> {
            if (response.canceled) {
                return;
            }
            let hotBar:HotBar;
            const session = getPlayerSession(this.player.name);
            const selection = response.formValues![0] as number;
            switch(selection) {
                case 0:
                    hotBar = getBetsToolHotBar();
                    break;
                case 1:
                    hotBar = session.getPreviousHotBar();
                    break;
                default:
                    hotBar = session.getHotBar(selection-2);
                }
            if (response.formValues![1] as boolean) {
                if (hotBar.isReadonly) {
                    this.player.sendMessage({
                       text:"Cannot modify a readonly hotbar" 
                    });
                    return;
                }
                hotBar.saveFromPlayer(this.player);
            } else {
                if (hotBar !== session.getPreviousHotBar()) {
                    session.getPreviousHotBar().saveFromPlayer(this.player);
                }
                hotBar.loadIntoPlayer(this.player);
            }
        })
    }
}