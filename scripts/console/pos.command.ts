import { Player, Vector3 } from "@minecraft/server";
import { Command, CommandArgType, CommandArgsLiteral, CommandOptions, CommandOutput } from "./commands";
import { getPlayerSession } from "../session/playerSessionRegistry";


const ManPos1 = "commands.pos.1.man";
const ManPos2 = "commands.pos.2.man";

const COMMAND_OPTIONS:CommandOptions =  {
    optionalArguments: new Map<string, CommandArgType>([
            ["set", "coordinates"],
            ["x", "float"],
            ["y", "float"],
            ["z", "float"],
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

    let changed = false;
    let coords = session.selection.getMainAnchor()?.location || {x:0,y:0,z:0};
    if (optionalArgs.has("set")) {
        coords = optionalArgs.get("set") as Vector3;
        changed=true;
    }
    
    if (optionalArgs.has("x")) {
        coords.x += optionalArgs.get("x") as number;
        changed=true;
    }
    
    if (optionalArgs.has("y")) {
        coords.y += optionalArgs.get("y") as number;
        changed=true;
    }
    if (optionalArgs.has("z")) {
        coords.z += optionalArgs.get("z") as number;
        changed=true;
    }
    
    
    if (changed) {
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

    let changed = false;
    let coords = session.selection.getSecondaryAnchor()?.location || {x:0,y:0,z:0};
    if (optionalArgs.has("set")) {
        coords = optionalArgs.get("set") as Vector3;
        changed=true;
    }
    
    if (optionalArgs.has("x")) {
        coords.x += optionalArgs.get("x") as number;
        changed=true;
    }
    
    if (optionalArgs.has("y")) {
        coords.y += optionalArgs.get("y") as number;
        changed=true;
    }
    if (optionalArgs.has("z")) {
        coords.z += optionalArgs.get("z") as number;
        changed=true;
    }
    
    
    if (changed) {
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


async function clearSelectionExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    const session = getPlayerSession(player.nameTag);
    session.selection.clear();


    return {
        message: {
            translate:"bets.commands.cls.result"       
        },
        status:"success"
    }
}



async function SelectionBlockSizeExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    const session = getPlayerSession(player.nameTag);

    if (!session.selection.isValid()) {
        return {
            status:"runtimeError",
            message:{translate:"bets.command.noSelection"}
        }
    }

    let size = session.selection.getBlockSize();



    return {
        message: {
            translate:"bets.commands.sbs.result",
            with: [`${size.x}`,`${size.y}`, `${size.z}`]
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

export const CLS_COMMAND:Command = new Command(
    "cls",
    ManPos2,
    clearSelectionExec
)

export const SBS_COMMAND:Command = new Command(
    "sbs",
    "bet.command.sbs.man",
    SelectionBlockSizeExec
)