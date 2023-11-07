import {OperatorResult} from "./operatorResult"
import {Operator} from "./operator"
import History from "../commits/history"
import { Player } from "@minecraft/server";

interface RedoParameters {

}

export default class OperatorRedo implements Operator<RedoParameters> {
    requiresParameters: boolean=false;
    parameters: RedoParameters;
    player: Player;

    constructor(player:Player, parameters:RedoParameters) {
        this.player=player;
        this.parameters=parameters;
    }
    
    
    execute(): Promise<OperatorResult> {
       return new Promise<OperatorResult> ((resolve, reject)=> {resolve(this.inrun());});
    }
    
    private inrun(): OperatorResult {
        let commit = History.Redo();
        if (commit == null) {
            return {
                status: "error",
                message: "There's not operations to redo in History"
            }
        }
        
        return {
            status: "success",
            message: `Redone: ${commit.message} (${History.getLength()}/${History.getCapacity()})`
        }
    
    
    }
    
}