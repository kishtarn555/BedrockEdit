import OperatorResult from "./OperatorResult"
import BtsOperator from "./Operator"
import History from "../commits/history"

export default class OperatorUndo extends BtsOperator {
    form(): void {
        
    }
    run(): OperatorResult {
        History.Undo();
        return {
            status: "warning",
            message: "Undone previous commit"
        }
    
    }
    
}