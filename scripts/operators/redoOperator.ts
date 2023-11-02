import OperatorResult from "./OperatorResult"
import BtsOperator from "./Operator"
import History from "../commits/history"

export default class OperatorRedo extends BtsOperator {
    form(): void {
        
    }
    run(): OperatorResult {
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