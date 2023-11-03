import { Entity, Player, world ,system} from "@minecraft/server"
import OperatorLine from "./lineOperator";
import OperatorResult from "./OperatorResult";
import BtsOperator from "./Operator";
import OperatorUndo from "./undoOperator";
import OperatorRedo from "./redoOperator";
import OperatorFill from "./fillOperator";
import { OperatorFlood } from "./floodOperator";

function logOperator(command: string, player: Player, response: OperatorResult) {
    const result = {
        "success": "§a",
        "error": "§c",
        "warning": "§e"
    }[response.status];
    const message = `[§9Bets§f] ${result}${response.message} `;

    player.sendMessage(message)

}

function attachOperatorItemUseListener() {
    world.beforeEvents.itemUse.subscribe((args) => {
        if (!args.itemStack?.typeId.startsWith("bets:operator")) return;
        args.cancel = true;
        let operator: BtsOperator;
        switch (args.itemStack.typeId) {
            case "bets:operator_line": operator = new OperatorLine(); break;
            case "bets:operator_undo": operator = new OperatorUndo(); break;
            case "bets:operator_redo": operator = new OperatorRedo(); break;
            case "bets:operator_fill": operator = new OperatorFill(); break;
            default: return;
        }
        system.run(()=>{
            // operator.form();
            operator.run().then(response=>
            logOperator(args.itemStack.typeId, args.source, response));
        });
    });

    let nextOperatorUse=0;
    const operatorDelay=10; 
    world.beforeEvents.itemUseOn.subscribe((args) => {
        if (!args.itemStack?.typeId.startsWith("bets:operator")) return;
        args.cancel = true;
        if (system.currentTick < nextOperatorUse) return;
        nextOperatorUse = system.currentTick + operatorDelay;
        let operator: BtsOperator;
        switch (args.itemStack.typeId) {
            case "bets:operator_flood": operator = new OperatorFlood(args.source, args.source.dimension, args.block.location); break;
            default: return;
        }
        system.run(()=>{
            // operator.form();
            operator.run().then(response=>
            logOperator(args.itemStack.typeId, args.source, response));
        });
    });
}

export {attachOperatorItemUseListener}