import { Dimension, Direction, Player, Vector3, world } from "@minecraft/server"
import { OperatorResult } from "./operatorResult"
import { Operator } from "./operator"
import { Commit } from "../commits/commit"
import History from "../commits/history"
import Workspace from "../workspace"
import { ChainReturner, TickChain, TickForeach, TickTimeForeach } from "../tickScheduler/scheduler"
import { OperatorReturner } from "./operatorReturner"
import BlockPlacingModeSelectionModal from "../modals/BlockPlacingModeModal"
import { StackOperatorArgsModal } from "../modals/StackOperatorArgsModal"
import { range } from "../tickScheduler/range"
import { getPlayerDirection } from "../playerUtils"
import { MemoryArea } from "../commits/memoryArea"
import { PlayerSession } from "../session/playerSession"
import { getPlayerSession } from "../session/playerSessionRegistry"
export interface StackParameters {
    mask?: "replace" | "masked",
    direction?: Direction,
    copies?: number
    useOffset?: boolean,
    offset?: Vector3,
}

const MAX_STACK_AREA = 524288; // This comes from Minecraft clone limit

export default class OperatorStack implements Operator<StackParameters> {

    requiresParameters: boolean = false
    parameters: StackParameters
    player: Player;
    session: PlayerSession
    workspace: Workspace | undefined

    constructor(player: Player, parameters: StackParameters) {
        this.parameters = parameters;
        this.player = player;
        this.session = getPlayerSession(player.name)
        this.workspace = this.session.getWorkspace();

    }


    private async getArguments() {
        if (
            this.parameters.copies == null ||
            this.parameters.direction == null ||
            this.parameters.mask == null
        ) {
            const modal = new StackOperatorArgsModal(getPlayerDirection(this.player));
            this.parameters = await modal.show(this.player);
        }
    }

    async execute(): Promise<OperatorResult> {
        try {
            await this.getArguments();
        } catch (err) {
            if (err === "cancelled") {
                return {
                    status: "error",
                    message: { translate: "bets.modal.arguments.cancelled" }
                }
            }
        }

        return new TickChain<undefined, OperatorResult>()
            .first(this.validate.bind(this))
            .finally(this.stack.bind(this))
            .run(undefined);
    }


    private loadWorkspace() {
        this.workspace!.load();
    }
    private async validate(returner: OperatorReturner) {
        if (this.parameters.useOffset == null) {
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: { translate: "bets.operator.stack.useOffset" }
                }
            });
            return;
        }
        if (this.parameters.useOffset && this.parameters.offset == null){
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: { translate: "bets.operator.stack.offset" }
                }
            });
            return;
        }
        if (!this.parameters.useOffset && this.parameters.direction == null) {
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: { translate: "bets.operator.stack.direction" }
                }
            });
            return;
        }
        if (this.parameters.mask == null) {
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: { translate: "bets.operator.stack.mask" }
                }
            });
            return;
        }
        if (this.parameters.copies == null) {
            returner.breakAndReturn({
                status: "error",
                message: {
                    translate: "bets.util.operator.no_argument",
                    with: ["bets.operator.stack.copies_count"]
                }
            });
            return;
        }
        if (this.workspace == null) {
            returner.breakAndReturn({
                status: "error",
                message: { text: "There's no valid selection" }
            });
            return;
        }
        if (this.workspace.getVolume() > MAX_STACK_AREA) {
            returner.breakAndReturn({
                status: "error",
                message: { text: `The selection cannot be larger than ${MAX_STACK_AREA}` }
            });
            return
        }

    }

    private getNextCorner(previous: Vector3, xs: number, ys: number, zs: number): Vector3 {
        let next = previous;
        if (this.parameters.useOffset!) {
            next.x += this.parameters.offset!.x;
            next.y += this.parameters.offset!.y;
            next.z += this.parameters.offset!.z;

            return next;
        }

        if (this.parameters.direction == null) {
            throw new Error("Direction is not sent (?)");
        }
        switch (this.parameters.direction) {
            case Direction.Up:
                next.y += ys;
                break;
            case Direction.Down:
                next.y -= ys;
                break;
            case Direction.South:
                next.z += zs;
                break;
            case Direction.North:
                next.z -= zs;
                break;
            case Direction.East:
                next.x += xs;
                break;
            case Direction.West:
                next.x -= xs;
                break;
        }
        return next;
    }

    private async stack(returner: OperatorReturner): Promise<OperatorResult> {
        let pos1: Vector3 = this.session.selection.getMainAnchorBlockLocation()!
        let pos2: Vector3 = this.session.selection.getSecondaryAnchorBlockLocation()!


        //NOTE: This might need a bump after fillBlocks is added
        let x1 = Math.min(pos1.x, pos2.x);
        let x2 = Math.max(pos1.x, pos2.x);
        let y1 = Math.min(pos1.y, pos2.y);
        let y2 = Math.max(pos1.y, pos2.y);
        let z1 = Math.min(pos1.z, pos2.z);
        let z2 = Math.max(pos1.z, pos2.z);

        pos1 = { x: x1, y: y1, z: z1 };
        pos2 = { x: x2, y: y2, z: z2 };

        const [width,height,depth] = [ x2 - x1 + 1, y2 - y1 + 1, z2 - z1 + 1];
        let corner = this.getNextCorner(pos1,width,height, depth);
        let copies = this.parameters.copies!;
        let recordArea:MemoryArea;
        let iter=0;
        const tickFor = new TickForeach(
            (_) => {
                recordArea = new MemoryArea(this.player.dimension, corner, {x:corner.x+width-1,y:corner.y+height-1,z:corner.z+depth-1});
                recordArea.record();
                this.player.runCommand(
                    `clone ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ${corner.x} ${corner.y} ${corner.z} ${this.parameters.mask!}`
                );
                for (const commit of recordArea.getDifferences(`Stack ${iter}`)) {
                    History.AddCommit(commit);
                }
                corner = this.getNextCorner(corner,width,height, depth);
                iter++;
            },
            1,
        );

        await tickFor.runOnIterable(range(copies));

        return {
            status: "success",
            message: { translate: "bets.operator.stack.message.success" }
        }


    }
    private unloadWorkspace() {

    }


}