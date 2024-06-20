import { Player, RawMessage, system, world } from "@minecraft/server";
import OperatorFill from "../fillOperator";
import OperatorLine from "../lineOperator";
import OperatorRedo from "../redoOperator";
import OperatorUndo from "../undoOperator";
import { Operator } from "../operator";
import { OperatorFlood } from "../floodOperator";
import { OperatorResult } from "../operatorResult";
import OperatorStack from "../stackOperator";
import { getPlayerSession } from "../../session/playerSessionRegistry";
import { OperatorStructureSave } from "../saveOperator";
import { OperatorStructureLoad } from "../loadOperator";
import { getBlockFromDirection } from "../../blockUtils";


function logOperator(command: string, player: Player, response: OperatorResult) {
    const result = {
        "success": "§a",
        "error": "§c",
        "warning": "§e"
    }[response.status];

    const message: RawMessage = {
        rawtext:
            [
                { text: "[§9Bets§f] " },
                { text: result },
                response.message
            ]
    }

    player.sendMessage(message)

}

function attachOperatorSimpleItemListener() {
    world.beforeEvents.itemUse.subscribe((args) => {
        if (!args.itemStack?.typeId.startsWith("bets:operator")) return;
        args.cancel = true;
        let player = args.source;
        let operator: Operator<any>;
        switch (args.itemStack.typeId) {
            case "bets:operator_line": operator = new OperatorLine(player, {}); break;
            case "bets:operator_undo": operator = new OperatorUndo(player, {}); break;
            case "bets:operator_redo": operator = new OperatorRedo(player, {}); break;
            case "bets:operator_fill": operator = new OperatorFill(player, {}); break;
            case "bets:operator_stack": operator = new OperatorStack(player, {}); break;
            case "bets:operator_save": operator = new OperatorStructureSave(player, {}); break;
            case "bets:operator_load": operator = new OperatorStructureLoad(player, {}); break;
            default: return;
        }
        
        runOperator(operator, args.itemStack.typeId, args.source);
    });
}

export function runOperator(operator:Operator<any>, commandId:string, source:Player) {
    system.run(() => {
        // operator.form();
        operator.execute()
            .then(
                response => logOperator(commandId, source, response)
            )
            .catch(
                reason => {
                    logOperator(commandId, source, {
                        message: { text: "Error 500" },
                        status: "error"
                    });
                    console.error((reason as Error).stack );
                }
            );
    });
} 

function attachOperatorItemOnBlockListener() {
    world.beforeEvents.itemUseOn.subscribe((args) => {
        if (!args.itemStack?.typeId.startsWith("bets:operator")) return;
        args.cancel = true;
        const player = args.source;
        const session = getPlayerSession(player.name);
        if (!session.checkCooldown("operator_item")) return;
        session.setCooldown("operator_item");
        let operator: Operator<any>;
        switch (args.itemStack.typeId) {
            case "bets:operator_flood":

                let location = args.block.location;

                if (args.source.isSneaking) {
                    location = getBlockFromDirection(args.block, args.blockFace)?.location ?? location;
                }

                operator = new OperatorFlood(
                    args.source,
                    { dimension: args.source.dimension, location: location }
                );
                break;
            default: return;
        }
        runOperator(operator, args.itemStack.typeId, args.source);
    });
}

export default function attachOperatorItemListeners() {
    attachOperatorItemOnBlockListener();
    attachOperatorSimpleItemListener();
}