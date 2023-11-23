import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { BlockPlacingMode } from "../blockPlacer";
import { getPlayerSession } from "../session/playerSessionRegistry";

const MODES = [
    {translate:"bets.modal.block_placing_mode_selection.normal.name"},
    {translate:"bets.modal.block_placing_mode_selection.keep.name"},
    {translate:"bets.modal.block_placing_mode_selection.replace_exactly.name"},
    {translate:"bets.modal.block_placing_mode_selection.replace_loosely.name"},
]
export default class BlockPlacingModeSelectionModal {
    modal: ModalFormData 

    constructor() {
        this.modal = 
        this.modal = new ModalFormData()
            .title({ translate:"bets.modal.block_placing_mode_selection.title.name"})
            .dropdown(
                {translate:"bets.modal.block_placing_mode_selection.options.name"},
                MODES,
                BlockPlacingMode.normal
            );
    }

    show(player:Player) :Promise<void> {
        return new Promise((resolve, reject)=> {
            this.modal.show(player).then(response=> {
                if (response.canceled) {
                    reject(response.cancelationReason);
                    return;
                }

                let mode = response.formValues![0] as number
                const session = getPlayerSession(player.name);
                session.blockPlacingMode = mode;

                player.sendMessage(["[§9Bets§f] ", MODES[mode]  ]) //FIXME Add translation key
            })
            .then(value=>resolve(value))
            .catch(error=> reject(error))
        });
    }

}
