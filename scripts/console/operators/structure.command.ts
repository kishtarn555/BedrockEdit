import { Player } from "@minecraft/server";
import { Command, CommandArgsLiteral, CommandOutput } from "../commands";
import { runOperator } from "../../operators/operatorUtil/itemListeners";
import { OperatorStructureSave } from "../../operators/saveOperator";
import { OperatorStructureLoad } from "../../operators/loadOperator";

async function saveExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    
    let saveOperator = new OperatorStructureSave(player,{});
    runOperator(saveOperator, "bets:operator_save", player);
    return {
        status:"success",
        message:{translate:"bets.command.operatorLaunched"}
    }
}


export const SAVE_COMMAND:Command = new Command(
    "save",
    "bets.command.save.man",
    saveExec,
)

async function loadExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    
    let loadOperator = new OperatorStructureLoad(player,{});
    runOperator(loadOperator, "bets:operator_load", player);
    return {
        status:"success",
        message:{translate:"bets.command.operatorLaunched"}
    }
}


export const LOAD_COMMAND:Command = new Command(
    "load",
    "bets.command.load.man",
    loadExec,
)