import { Player } from "@minecraft/server";
import { Command, CommandArgsLiteral, CommandOutput } from "../commands";
import OperatorFill from "../../operators/fillOperator";
import { runOperator } from "../../operators/operatorUtil/itemListeners";

async function fillExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    let params:{mode?:"normal"|"keep"|"replace"|"loosely"} = {}
    if (optionalArgs.has("mode")) {
        let mode = optionalArgs.get("mode") as string;
        if (["normal", "keep","replace","loosely"].indexOf(mode)===-1)  {
            return {
                status:"parseError",
                message:{translate:"bets.command.fill.unkownMode", with:[mode]}
            }
        }
        params["mode"]=mode as "normal"|"keep"|"replace"|"loosely";

    }
    let fillOperator = new OperatorFill(player,params);
    runOperator(fillOperator, "bets:operator_fill", player);
    return {
        status:"success",
        message:{translate:"bets.command.operatorLaunched"}
    }
}


export const FILL_COMMAND:Command = new Command(
    "fill",
    "bets.command.fill.man",
    fillExec,
    {
        optionalArguments: new Map([
            ["mode","string"]
        ])
    }

)