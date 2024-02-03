import { registerCommand } from "./commands";
import { CLS_COMMAND, POS1COMMAND, POS2COMMAND } from "./pos.command";

export function registerAllCommands() {
    registerCommand(POS1COMMAND)
    registerCommand(POS2COMMAND)
    registerCommand(CLS_COMMAND)


}
