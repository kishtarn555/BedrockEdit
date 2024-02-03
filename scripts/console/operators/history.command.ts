import { Player } from "@minecraft/server";
import { Command, CommandArgsLiteral, CommandOutput } from "../commands";
import { runOperator } from "../../operators/operatorUtil/itemListeners";
import OperatorUndo from "../../operators/undoOperator";
import OperatorRedo from "../../operators/redoOperator";

async function undoExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    
    let undoOperator = new OperatorUndo(player,{});
    runOperator(undoOperator, "bets:operator_undo", player);
    return {
        status:"success",
        message:{translate:"bets.command.operatorLaunched"}
    }
}


export const UNDO_COMMAND:Command = new Command(
    "undo",
    "bets.command.undo.man",
    undoExec,
)


async function redoExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    
    let redoOperator = new OperatorRedo(player,{});
    runOperator(redoOperator, "bets:operator_redo", player);
    return {
        status:"success",
        message:{translate:"bets.command.operatorLaunched"}
    }
}


export const REDO_COMMAND:Command = new Command(
    "redo",
    "bets.command.redo.man",
    redoExec,
)