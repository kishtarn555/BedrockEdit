import { Player } from "@minecraft/server";
import { Command, CommandArgsLiteral, CommandOutput } from "../commands";
import { runOperator } from "../../operators/operatorUtil/itemListeners";
import { OperatorStructureSave } from "../../operators/saveOperator";
import { OperatorStructureLoad } from "../../operators/loadOperator";
import { loadAllStructureIdentifiers, loadStructureRegister } from "../../db/dbStructures";

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



async function listStructuresExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    let list = loadAllStructureIdentifiers();
    let str = JSON.stringify(list);
    return {
        status:"success",
        message:{translate:"bets.command.list_structures", with:[str]}
    }
}



export const STL_COMMAND:Command = new Command(
    "stl",
    "bets.command.stl.man",
    listStructuresExec,
)



async function structureDataExec(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {

    const structureName = positionalArgs[0] as string;
    const register = loadStructureRegister(structureName);

    if (register == null) {
        return {
            status:"runtimeError",
            message: {translate: "bets.command.structure_data.unknown_identifier", with:[structureName]}
        }
    }
    if (flags.indexOf("r")!==-1) {        
        return {
            status:"success",
            message:{translate:"bets.command.structure_data", with:[structureName,JSON.stringify(register)]}
        }   
    }
    const message = `${register.x_length}x ${register.y_length}y ${register.z_length}z @ ${register.dx.toFixed(2)}dx ${register.dz.toFixed(2)}dz`
    return {
        status:"success",
        message:{translate:"bets.command.structure_data", with:[structureName,message]}
    }
}



export const STDATA_COMMAND:Command = new Command(
    "stdata",
    "bets.command.stl.man",
    structureDataExec,
    {
        positionalArguments: [
            "string"
        ],
        flags: [
            "r"
        ]
    }
)

