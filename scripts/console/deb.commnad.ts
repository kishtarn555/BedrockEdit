import { BlockPermutation, BlockStates, BlockTypes, Player, world } from "@minecraft/server";
import { Command, CommandArgsLiteral, CommandOptions, CommandOutput } from "./commands";


const ManDeb = "commands.sel.man";

const COMMAND_OPTIONS:CommandOptions =  {
}

async function calculateAllBlockTypes(
    player: Player,
    positionalArgs : CommandArgsLiteral[],
    optionalArgs : Map<string, CommandArgsLiteral>,
    flags: string[]
): Promise<CommandOutput> {
    let types = BlockTypes.getAll();
    let cnt =0;
    for (const blockType of types) {        
        let states = BlockPermutation.resolve(blockType.id).getAllStates()
        let sub = 1;
        for (const state in states) {
            sub *= (BlockStates.get(state)?.validValues.length ?? 1)
        }

        cnt+= sub;
    }
    const ratio = cnt / 65536
    const percentage = (Math.round(ratio * 100 *100) / 100).toFixed(2)
    return {
        message: {
            text:`Blocks: ${types.length}\nBlock states: ${cnt} (${percentage}%%)`,
        },
        status: "success"
    }
}



export const DEB_COMMNAD:Command = new Command(
    "deb",
    ManDeb,
    calculateAllBlockTypes,
    COMMAND_OPTIONS
)
