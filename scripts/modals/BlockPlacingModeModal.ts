import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { BetsBlockPlacer } from "../variables";
import { BlockPlacingMode } from "../blockPlacer";

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
                BetsBlockPlacer.operationMode
            );
    }

    show(player:Player) {
        this.modal.show(player).then(response=> {
            let mode = response.formValues![0] as number
            BetsBlockPlacer.operationMode = mode;

            player.sendMessage(["[§9Bets§f] ", MODES[mode]  ]) //FIXME Add translation key
        }).catch(error=> {})
    }

}
