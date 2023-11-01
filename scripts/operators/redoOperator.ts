import OperatorResult from "./OperatorResult"
import BtsOperator from "./Operator"
import History from "../commits/history"

export default class OperatorRedo extends BtsOperator {
    form(): void {
        
    }
    run(): OperatorResult {
        History.Redo();
        return {
            status: "warning",
            message: "Redo previous commit"
        }
    
    }
    
}