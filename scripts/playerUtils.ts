import { Direction, Player } from "@minecraft/server";

export function getPlayerDirection(player:Player):Direction {
    const dir = player.getViewDirection();
    let dx = Math.abs(dir.x);
    let dy = Math.abs(dir.y);
    let dz = Math.abs(dir.z);

    if (dx >= dy && dx >= dz) {
        if (dir.x > 0) return Direction.East;
        return Direction.West;
    }
    if (dy >= dx && dy >= dz) {
        if (dir.y > 0) return Direction.Up;
        return Direction.Down;
    }
    if (dz >= dx && dz >= dy) {
        if (dir.z > 0) return Direction.South;
        return Direction.North;
    }
    return Direction.Up;

}