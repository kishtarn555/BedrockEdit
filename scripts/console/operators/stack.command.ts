import { Player } from "@minecraft/server";
import { Command, CommandArgsLiteral, CommandOutput } from "../commands";
import { runOperator } from "../../operators/operatorUtil/itemListeners";
import OperatorStack from "../../operators/stackOperator";

async function stackExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    
    let stackOperator = new OperatorStack(player,{});
    runOperator(stackOperator, "bets:operator_stack", player);
    return {
        status:"success",
        message:{translate:"bets.command.operatorLaunched"}
    }
}


export const STACK_COMMAND:Command = new Command(
    "stack",
    "bets.command.stack.man",
    stackExec,
    
)