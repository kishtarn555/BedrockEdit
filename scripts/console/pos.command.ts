import { Player, Vector3 } from "@minecraft/server";
import { Command, CommandArgType, CommandArgsLiteral, CommandOptions, CommandOutput } from "./commands";
import { getPlayerSession } from "../session/playerSessionRegistry";


const ManPos1 = "commands.pos.1.man";
const ManPos2 = "commands.pos.2.man";

const COMMAND_OPTIONS:CommandOptions =  {
    optionalArguments: new Map<string, CommandArgType>([
            ["set", "coordinates"]
    ])
}

async function pos1exec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    const session = getPlayerSession(player.nameTag);
    const selection = session.selection;
    if (optionalArgs.has("set")) {
        let coords = optionalArgs.get("set") as Vector3;
        selection.setMainAnchor(player.dimension, coords);
        let position = `§6[  ${coords.x}, ${coords.y}, ${coords.z} ]@${player.dimension.id} §r`
        return {
            status:"success",
            message: {
                translate:"bets.commands.pos.set.result",
                with: ["pos1", position]
            }
        }
    }

    let anchor = selection.getMainAnchor();
    if (anchor == null) {
        return {
            message: {
                translate:"bets.commands.pos.query.notSet",
                with:["pos1"]            
            },
            status:"success"
        }
    }
    const id = anchor.dimension.id
    let position = `§6[  ${anchor.location.x}, ${anchor.location.y}, ${anchor.location.z} ]@${id} §r`

    return {
        message: {
            translate:"bets.commands.pos.query.result",
            with:["pos1",position]            
        },
        status:"success"
    }
}


async function pos2exec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    const session = getPlayerSession(player.nameTag);
    const selection = session.selection;
    if (optionalArgs.has("set")) {
        let coords = optionalArgs.get("set") as Vector3;
        selection.setSecondaryAnchor(player.dimension, coords);
        let position = `§6[  ${coords.x}, ${coords.y}, ${coords.z} ]@${player.dimension.id} §r`
        return {
            status:"success",
            message: {
                translate:"bets.commands.pos.set.result",
                with: ["pos2", position]
            }
        }
    }

    let anchor = selection.getSecondaryAnchor();
    if (anchor == null) {
        return {
            message: {
                translate:"bets.commands.pos.query.notSet",
                with:["pos2"]            
            },
            status:"success"
        }
    }
    const id = anchor.dimension.id
    let position = `§6[  ${anchor.location.x}, ${anchor.location.y}, ${anchor.location.z} ]@${id} §r`

    return {
        message: {
            translate:"bets.commands.pos.query.result",
            with:["pos2",position]            
        },
        status:"success"
    }
}


export const POS1COMMAND:Command = new Command(
    "pos1",
    ManPos1,
    pos1exec,
    COMMAND_OPTIONS
)


export const POS2COMMAND:Command = new Command(
    "pos2",
    ManPos2,
    pos2exec,
    COMMAND_OPTIONS
)