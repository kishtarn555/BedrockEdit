import { Block, BlockPermutation, Dimension, Vector3 } from "@minecraft/server";
import { Commit } from "./commit";

export class MemoryArea {
    dimension: Dimension;
    minPos: Vector3;
    maxPos: Vector3;
    memory: Record<string, BlockPermutation | undefined>; // You can adjust the type based on what you want to store

    constructor(dimension: Dimension, minPos: Vector3, maxPos: Vector3) {
        this.dimension = dimension;
        this.minPos = minPos;
        this.maxPos = maxPos;
        this.memory = {}; // Initialize memory as an empty object
    }

    record() {
        for (let x = this.minPos.x; x <= this.maxPos.x; x++) {
            for (let y = this.minPos.y; y <= this.maxPos.y; y++) {
                for (let z = this.minPos.z; z <= this.maxPos.z; z++) {
                    const currentPos = { x, y, z };
                    const block = this.dimension.getBlock(currentPos);
                    // Assuming this.dimension.getBlock returns some information about the block at the given position
                    // Store the information in memory using the coordinates as a key
                    this.memory[`${x},${y},${z}`] = block?.permutation;
                }
            }
        }
    }

    getDifferences(commitMessage:string) :Commit[]{
        const commits:Commit[] = []
        let currentCommit = new Commit(commitMessage);
        for (let x = this.minPos.x; x <= this.maxPos.x; x++) {
            for (let y = this.minPos.y; y <= this.maxPos.y; y++) {
                for (let z = this.minPos.z; z <= this.maxPos.z; z++) {
                    const currentPos = { x, y, z };
                    const blockInMemory = this.memory[`${x},${y},${z}`];
                    const currentBlock = this.dimension.getBlock(currentPos)?.permutation;

                    if (blockInMemory == null || currentBlock == null) {
                        //TODO: Issue warning
                        continue;
                    }

                    // Compare the blocks and store the differences in the differences object
                    if (blockInMemory !== currentBlock) {
                        currentCommit.saveChange(this.dimension, currentPos, blockInMemory, currentBlock);
                        let [newCommit, previousCommit] = currentCommit.splitCommitIfLengthIsExceeded();
                        currentCommit = newCommit;
                        if (previousCommit != null) {
                            commits.push(previousCommit);
                        }
                    }
                }
            }
        }
        commits.push(currentCommit);
        return commits;
    }
    
}