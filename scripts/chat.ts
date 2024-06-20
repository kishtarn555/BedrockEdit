import { Player, RawMessage, world } from "@minecraft/server";

type StatusType = "success"| "error" | "warning" | "debug"
export function logToPlayer(player:Player, status:StatusType, message:RawMessage) {
    const result = {
        "success": "§a",
        "error": "§c",
        "warning": "§e",
        "debug": "§5",
    }[status];

    const chatMessage: RawMessage = {
        rawtext:
            [
                { text: "[§9Bets§f] " },
                { text: result },
                message
            ]
    }

    player.sendMessage(chatMessage)
}


export function logDebug(message:string) {
    world.sendMessage({
        rawtext: [
            { text: "[§9Bets§f]§5 " },
            { text: message }

        ]
    });
}