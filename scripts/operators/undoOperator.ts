import OperatorResult from "./OperatorResult"
import BtsOperator from "./Operator"
import History from "../commits/history"

export default class OperatorUndo extends BtsOperator {
    form(): void {
        
    }
    run(): OperatorResult {
        let commit = History.Undo();
        if (commit == null) {
            return {
                status: "error",
                message: `There's not operations to undo in History`
            }
        }
        
        return {
            status: "success",
            message: `Undone: ${commit.message} (${History.getLength()}/${History.getCapacity()}) `
        }
    
    }
    
}