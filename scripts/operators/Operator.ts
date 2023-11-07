import { Player } from "@minecraft/server"
import { OperatorResult } from "./operatorResult"
export interface Operator<T> {
    requiresParameters:boolean
    parameters:T
    player:Player
    execute():Promise<OperatorResult>
}

