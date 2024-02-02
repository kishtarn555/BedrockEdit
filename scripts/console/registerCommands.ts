import { registerCommand } from "./commands";
import { POS1COMMAND, POS2COMMAND } from "./pos.command";

export function registerAllCommands() {
    registerCommand(POS1COMMAND)
    registerCommand(POS2COMMAND)


}
