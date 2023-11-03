import { Player } from "@minecraft/server";
import { ChainReturner } from "../tickScheduler/scheduler";
import OperatorResult from "./OperatorResult";

export default abstract class BtsOperator {
    protected player:Player|undefined;
    abstract form():void;
    abstract run():Promise<OperatorResult>;
}

 type OperatorReturner = ChainReturner<OperatorResult>;

 export {OperatorReturner};