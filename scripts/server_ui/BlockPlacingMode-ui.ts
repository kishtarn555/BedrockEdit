import { ModalFormData } from "@minecraft/server-ui";

export default class BlockPlacingModeSelectionModal {
    modal: ModalFormData 

    constructor() {
        this.modal = 
        this.modal = new ModalFormData()
            .title({ translate:"bets.modal.block_placing_mode_selection.title.name"})
            .dropdown(
                {translate:"bets.modal.block_placing_mode_selection.options.name"},
                [
                    {translate:"bets.modal.block_placing_mode_selection.normal.name"},
                    {translate:"bets.modal.block_placing_mode_selection.keep.name"},
                    {translate:"bets.modal.block_placing_mode_selection.replace_exactly.name"},
                    {translate:"bets.modal.block_placing_mode_selection.replace_loosely.name"},
                ]
            );
    }

}
