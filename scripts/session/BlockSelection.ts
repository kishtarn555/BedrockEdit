import { BlockPermutation } from "@minecraft/server";

export class BlockSelection {
    mainBlockPermutation:BlockPermutation | undefined
    secondaryBlockPermutation:BlockPermutation | undefined

    constructor(mainBlockPermutation?: BlockPermutation, secondaryBlockPermutation?: BlockPermutation) {
        this.mainBlockPermutation = mainBlockPermutation;
        this.secondaryBlockPermutation = secondaryBlockPermutation;
    }


    isValid():boolean {
        return this.mainBlockPermutation != null;
    }

    


}