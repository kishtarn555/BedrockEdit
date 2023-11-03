// import { CommandError, Vector3, world } from "@minecraft/server"
// import { BetsBlocks, BetsCoords } from "../variables"
// import OperatorResult from "./OperatorResult"
// import { plot3D } from "../BresenhamLine"
// import BtsOperator from "./Operator"

// export default class OperatorLine extends BtsOperator {
//     form(): void {
        
//     }
//     run(): OperatorResult {
//         if (!BetsCoords.arePositionsValid()) {
//             return {
//                 status: "error",
//                 message: "Positions are not valid"
//             }
    
//         }
//         if (!BetsBlocks.isBlock1Valid()) {
//             return {
//                 status: "error",
//                 message: "No block picked"
//             }
    
//         }
//         //NOTE: when fillblocks is released, we might want to upgrade to it 
//         let result: OperatorResult
//         try {
//             let pos1: Vector3 = BetsCoords.getPos1()!
//             let pos2: Vector3 = BetsCoords.getPos2()!
    
//             let points = plot3D(
//                 Math.floor(pos1.x),
//                 Math.floor(pos1.y),
//                 Math.floor(pos1.z),
//                 Math.floor(pos2.x),
//                 Math.floor(pos2.y),
//                 Math.floor(pos2.z),
//             )
    
//             //NOTE: This might need a bump after fillBlocks is added
//             for (const point of points) {
//                 // world.getDimension(dimension).runCommand(`setblock ${point.x} ${point.y} ${point.z} ${blockStatement}`);
//                 //FIXME: Support multidimension
//                 //FIXME: Add arguments
//                 world.getDimension("overworld").getBlock(point)?.setPermutation(BetsBlocks.getBlock1()!);
//             }
//             return {
//                 status: "success",
//                 message: [Math.floor(pos1.x),
//                     Math.floor(pos1.y),
//                     Math.floor(pos1.z),
//                     Math.floor(pos2.x),
//                     Math.floor(pos2.y),
//                     Math.floor(pos2.z)].join(",")
//             }
            
//         } catch (error) {
           
//             // @ts-ignore
//             world.sendMessage(error.message) 
//         }
//         return {
//             status: "error",
//             message: "THIS PATH SHOULD NOT BE ACCESSED, CONTACT DEV"
//         }
    
//     }
    
// }