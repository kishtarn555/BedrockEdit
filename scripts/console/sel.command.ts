import { Player, Vector3 } from "@minecraft/server";
import { Command, CommandArgType, CommandArgsLiteral, CommandOptions, CommandOutput } from "./commands";
import { getPlayerSession } from "../session/playerSessionRegistry";

const ManSel = "commands.sel.man";

const COMMAND_OPTIONS:CommandOptions =  {
    positionalArguments: [
        "coordinates", "coordinates"
    ]
}

async function selExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    const session = getPlayerSession(player.nameTag);
    const selection = session.selection;
    selection.setMainAnchor(player.dimension, positionalArgs[0] as Vector3);
    selection.setSecondaryAnchor(player.dimension, positionalArgs[1] as Vector3);
    return {
        message: {
            translate:"bets.commands.sel.query.result"         
        },
        status:"success"
    }
}




export const SEL_COMMAND:Command = new Command(
    "sel",
    ManSel,
    selExec,
    COMMAND_OPTIONS
)
