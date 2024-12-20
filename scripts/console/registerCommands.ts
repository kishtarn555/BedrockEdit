import { registerCommand } from "./commands";
import { DEB_COMMNAD } from "./deb.commnad";
import { FILL_COMMAND } from "./operators/fill.command";
import { REDO_COMMAND, UNDO_COMMAND } from "./operators/history.command";
import { STACK_COMMAND } from "./operators/stack.command";
import { LOAD_COMMAND, SAVE_COMMAND, STDATA_COMMAND, STL_COMMAND } from "./operators/structure.command";
import { CLS_COMMAND, POS1COMMAND, POS2COMMAND, SBS_COMMAND } from "./pos.command";
import { SEL_COMMAND } from "./sel.command";
import { BST_COMMAND, GETS_COMMAND } from "./stateSlot.command";

export function registerAllCommands() {
    registerCommand(POS1COMMAND);
    registerCommand(POS2COMMAND);
    registerCommand(CLS_COMMAND);
    registerCommand(SBS_COMMAND);
    registerCommand(SEL_COMMAND);
    
    registerCommand(FILL_COMMAND);
    registerCommand(STACK_COMMAND);

    registerCommand(UNDO_COMMAND);
    registerCommand(REDO_COMMAND);

    registerCommand(LOAD_COMMAND);
    registerCommand(SAVE_COMMAND);
    registerCommand(STL_COMMAND);
    registerCommand(STDATA_COMMAND);

    registerCommand(BST_COMMAND)
    registerCommand(GETS_COMMAND)

    registerCommand(DEB_COMMNAD)


}
