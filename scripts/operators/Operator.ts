import { ChainReturner } from "../tickScheduler/scheduler";
import OperatorResult from "./OperatorResult";

export default abstract class BtsOperator {
    abstract form():void;
    abstract run():Promise<OperatorResult>;
}

 type OperatorReturner = ChainReturner<OperatorResult>;

 export {OperatorReturner};