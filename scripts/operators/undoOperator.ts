import {OperatorResult} from "./operatorResult"
import {Operator} from "./operator"
import History from "../commits/history"
import { Player } from "@minecraft/server";

interface UndoParameters {

}

export default class OperatorUndo implements Operator<UndoParameters> {
    requiresParameters: boolean=false;
    parameters: UndoParameters;
    player: Player;

    constructor(player:Player, parameters:UndoParameters) {
        this.player=player;
        this.parameters=parameters;
    }
    
    
    execute(): Promise<OperatorResult> {
       return new Promise<OperatorResult> ((resolve, reject)=> {resolve(this.run());});
    }
    
    private run(): OperatorResult {
        let commit = History.Undo();
        if (commit == null) {
            return {
                status: "error",
                message: "There's not operations to undo in History"
            }
        }
        
        return {
            status: "success",
            message: `Undone: ${commit.message} [${commit.part}] (${History.getLength()}/${History.getCapacity()})`
        }
    
    
    }
    
}