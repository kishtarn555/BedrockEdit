import { PlayerSession } from "./playerSession";

const playerSessions: { [name: string]: PlayerSession } = {};

export function getPlayerSession(nameTag: string): PlayerSession {
    // Check if the session already exists
    if (playerSessions[nameTag]) {
        return playerSessions[nameTag];
    }

    // If the session does not exist, create a new one
    const newSession: PlayerSession = new PlayerSession(nameTag);

    playerSessions[nameTag] = newSession;

    return newSession;
}

export function getAllPlayerSessions(): PlayerSession[] {
    const sessions: PlayerSession[] = [];

    // Iterate through the properties of playerSessions and push values to the array
    for (const nameTag in playerSessions) {
        if (playerSessions.hasOwnProperty(nameTag)) {
            sessions.push(playerSessions[nameTag]);
        }
    }

    return sessions;
}