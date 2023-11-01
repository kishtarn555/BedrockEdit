import {
    world,
    system,
    Entity,
    Player
} from "@minecraft/server";

import { pos1, pos2 } from "./commands/posCommands";
import { fillScriptEventCommand } from "./commands/fillCommand";
import { CommandResponse } from "./commands/syntaxHelper";
import { lineScriptEventCommand } from "./commands/lineCommand";

function reportCommand(command:string,entity: Entity | undefined, response: CommandResponse) {
    const result = {
        "successful": "§a",
        "error": "§c",
        "noexec": "§d",
        "warning": "§e"
    }[response.commandStatus];
    const message = `§9[Bets:${command}] ${result}${response.message} `;
    if (entity instanceof Player) {
        (entity as Player).sendMessage(message)
    } else {
        world.sendMessage(message);
    }
}

export default function attachScriptEventsWatcher() {
    system.afterEvents.scriptEventReceive.subscribe((event) => {
        let id = event.id;
        let entity = event.sourceEntity
        if (!id.startsWith("bets:")) {
            return; // This event does not concern us
        }
        const parts: string[] = id.split(":");
        let command = parts[1];
        let response: CommandResponse | undefined = undefined
        switch (command) {
            case "pos1": response = pos1(event); break;
            case "pos2": response = pos2(event); break;
            case "fill": response = fillScriptEventCommand(event); break;
            case "line": response = lineScriptEventCommand(event); break;
            default:
                response = { commandStatus: "error", message: "Unknown command" };
                break;
        }
        reportCommand(command,entity, response);


    });

}