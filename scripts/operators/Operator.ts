import OperatorResult from "./OperatorResult";

export default abstract class BtsOperator {
    abstract form():void;
    abstract run():Promise<OperatorResult>;
}