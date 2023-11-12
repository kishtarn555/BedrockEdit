import { RawMessage } from "@minecraft/server"

export interface OperatorResult {
    status:"success"|"warning"|"error"
    message: RawMessage
}
