

import { Entity, EntityGroundOffsetComponent, Player, RawMessage, Vector3, system, world } from "@minecraft/server";
import OperatorFill from "../operators/fillOperator";
import OperatorLine from "../operators/lineOperator";
import OperatorRedo from "../operators/redoOperator";
import OperatorUndo from "../operators/undoOperator";
import { Operator } from "../operators/operator";
import { OperatorFlood } from "../operators/floodOperator";
import { OperatorResult } from "../operators/operatorResult";
import OperatorStack from "../operators/stackOperator";
import { getPlayerSession } from "../session/playerSessionRegistry";
import { OperatorStructureSave } from "../operators/saveOperator";
import { OperatorStructureLoad } from "../operators/loadOperator";
import { PlayerSession } from "../session/playerSession";



export interface CommandOutput {
    message: RawMessage
    status: "parseError" | "runtimeError" | "success"
}


export type CommandArgType = "int" | "float" | "string" | "boolean" | "coordinates"

export type CommandArgsLiteral = number | string | boolean | Vector3

type CommandCallback = (
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
    ) => Promise<CommandOutput>

export interface CommandOptions {
    positionalArguments?: CommandArgType[]
    flags?: string[]
    optionalArguments?: Map<string, CommandArgType>
}
export class Command {
    command: string
    manDocs: string
    positionalArguments: CommandArgType[]
    flags: string[]
    optionalArguments: Map<string, CommandArgType>
    run: CommandCallback

    constructor(
        command: string,
        manDocs: string,
        callback: CommandCallback,
        options?: CommandOptions
    ) {
        this.command = command;
        this.manDocs = manDocs;
        this.run = callback;

        this.positionalArguments = options?.positionalArguments ?? [];
        this.flags = options?.flags ?? [];
        this.optionalArguments = options?.optionalArguments ?? new Map<string, CommandArgType>();
    }

}


const COMMANDS: Map<string, Command> = new Map<string, Command>()

type parameterStatus = "EOF" | "error" | "success"
const intRegex = /^\-?\d+$/

const floatRegex = /^\-?\d+(.\d+)?$/

function getParameters(components: string[], index: number, argType: CommandArgType, player: Player): [parameterStatus, number, CommandArgsLiteral] {
    if (components.length <= index) {
        return [
            "EOF", 0, "error"
        ];
    }

    if (argType === "boolean") {
        if (components[index] === "true") {
            return ["success", 1, true]
        }
        if (components[index] === "false") {
            return ["success", 1, false]
        }
        return ["error", 0, "error"]
    }

    if (argType === "int") {
        if (!intRegex.test(components[index])) {
            return ["error", 0, "error"]
        }
        return ["success", 1, parseInt(components[index])]
    }

    if (argType === "float") {
        if (!floatRegex.test(components[index])) {
            return ["error", 0, "error"]
        }
        return ["success", 1, parseFloat(components[index])]
    }

    if (argType === "string") {
        return ["success", 1, components[index]];
    }

    if (argType === "coordinates") {
        if (components.length <= index + 2) {
            return ["EOF", components.length - index, "error"]
        }

        let vals: number[] = []
        let playerCoords = [player.location.x, player.location.y, player.location.z]
        for (let i = 0; i < 3; i++) {
            let cid = index + i;
            if (components[cid].startsWith("~")) {
                let offset=0
                if (components[cid].length > 1 ) {
                    if (!floatRegex.test(components[cid].substring(1))) {
                        return ["error", i, "error"];
                    }
                    offset = parseFloat(components[cid].substring(1));
                }
                vals.push(playerCoords[i]+offset);
            } else {
                if (!floatRegex.test(components[cid])) {
                    return ["error", i, "error"];
                }
                vals.push(parseFloat(components[cid]));
            }
        }
        let vector:Vector3 = {
            x : vals[0],
            y : vals[1],
            z : vals[2],
        } 

        return ["success", 3, vector];

    }

    return ["error", -1, "UNKNOWN DATA TYPE"];


}


async function parseCommand(commandIdentifier: string, args: string, source: Player): Promise<CommandOutput> {
    let components = args.split(/\s+/)
    let command = COMMANDS.get(commandIdentifier)
    if (command == null) {
        source.sendMessage("Unknown command")
        return {
            message: { translate: "bets.commands.error.unknown_command", with: { text: commandIdentifier } },
            status: "parseError"
        }; //TODO
    }
    
    let optionalArgs = new Map<string, CommandArgsLiteral>()
    let flags: string[] = []
    let positionalArgs: CommandArgsLiteral[] = []
    
    let positionalIndex=0;
    if (components[0]==="") {
        return command.run(source, positionalArgs, optionalArgs, flags);
    }
    for (let i = 0; i < components.length; i++) {
        if (components[i].startsWith("-")) {
            let key = components[i].substring(1);
            if (command.flags.indexOf(key) !== -1) {
                flags.push(key);
                continue;
            }
            if (!command.optionalArguments.has(key)) {
                return {
                    message: { translate: "bets.commands.error.unknown_argument", with: { text: components[i] } },
                    status: "parseError"
                }
            }

            let [status, jump, value] = getParameters(components, i + 1, command.optionalArguments.get(key)!, source);

            if (status === "error") {
                return {
                    status:"parseError",
                    message: { translate: "bets.commands.error.syntax_error", with: { text: components[i+jump] } }
                }
            }

            if (status === "EOF") {
                return {
                    status:"parseError",
                    message: { translate: "bets.commands.error.eof"}
                }
            }

            optionalArgs.set(key, value);
            
            i+=jump;
            continue;
        }
        // We are paring an positional Argument.
        if ( command.positionalArguments.length <= positionalIndex) {
            return {
                message:{translate:"bets.commands.error.tooManyArgs", with:[components[i]]},
                status:"parseError"
            }
        }
        let argType = command.positionalArguments[positionalIndex];
        let [status,jump,value] = getParameters(components, i, argType, source);
        if (status === "error") {
            return {
                status:"parseError",
                message: { translate: "bets.commands.error.syntax_error", with: { text: components[i+jump] } }
            }
        }

        if (status === "EOF") {
            return {
                status:"parseError",
                message: { translate: "bets.commands.error.eof"}
            }
        }
        positionalArgs.push(value);
        i+=jump-1;
    }
    return command.run(source, positionalArgs, optionalArgs, flags);
}

export function registerCommand(command: Command) {
    COMMANDS.set(command.command, command);
}

export function attachCommandsListener() {


    system.afterEvents.scriptEventReceive.subscribe(
        (arg) => {
            if (arg.sourceEntity == null) {
                return;
            }
            let player = world.getPlayers({
                name: arg.sourceEntity.nameTag
            })
            if (player == null || player.length === 0) {
                return;
            }
            const IDENTIFIER = arg.id.split(":")[1];
            parseCommand(IDENTIFIER, arg.message, player[0])
            .then(result=> {
                player[0].sendMessage(result.message)
            }).catch(error=> {
                console.error(error.message)
            })


        },
        { namespaces: ["bets"] }
    )


}
