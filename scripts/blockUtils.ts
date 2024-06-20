import { Block, Direction} from "@minecraft/server"


export function getBlockFromDirection(block:Block, direction:Direction): Block | undefined {
    switch(direction) {
        case Direction.Down:
            return block.below();
        case Direction.Up:
            return block.above();
        case Direction.East:
            return block.east();
        case Direction.West:
            return block.west();
        case Direction.South:
            return block.south();
        case Direction.North:
            return block.north();
    }
    return undefined;
}