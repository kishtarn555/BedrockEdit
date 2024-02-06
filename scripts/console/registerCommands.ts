import { registerCommand } from "./commands";
import { FILL_COMMAND } from "./operators/fill.command";
import { REDO_COMMAND, UNDO_COMMAND } from "./operators/history.command";
import { LOAD_COMMAND, SAVE_COMMAND } from "./operators/structure.command";
import { CLS_COMMAND, POS1COMMAND, POS2COMMAND, SBS_COMMAND } from "./pos.command";

export function registerAllCommands() {
    registerCommand(POS1COMMAND);
    registerCommand(POS2COMMAND);
    registerCommand(CLS_COMMAND);
    registerCommand(SBS_COMMAND);
    
    registerCommand(FILL_COMMAND);    
    registerCommand(UNDO_COMMAND);
    registerCommand(REDO_COMMAND);
    registerCommand(LOAD_COMMAND);
    registerCommand(SAVE_COMMAND);


}