import { Entity, Player, world ,system} from "@minecraft/server"
import OperatorLine from "./lineOperator";
import OperatorResult from "./OperatorResult";
import BtsOperator from "./Operator";

function logOperator(command: string, player: Player, response: OperatorResult) {
    const result = {
        "success": "§a",
        "error": "§c",
        "warning": "§e"
    }[response.status];
    const message = `§9[${command}] ${result}${response.message} `;

    player.sendMessage(message)

}

function attachOperatorItemUseListener() {
    world.beforeEvents.itemUse.subscribe((args) => {
        if (!args.itemStack?.typeId.startsWith("bets:operator")) return;
        args.cancel = true;
        let operator: BtsOperator;
        switch (args.itemStack.typeId) {
            case "bets:operator_line": operator = new OperatorLine(); break;
            default: return;
        }
        system.run(()=>{
            operator.form();
            let response = operator.run();
            logOperator(args.itemStack.typeId, args.source, response);
        });
    });
}

export {attachOperatorItemUseListener}