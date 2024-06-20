import { world, system, BlockPermutation, ItemUseOnBeforeEvent, PlayerBreakBlockBeforeEvent, Dimension, ScriptEventCommandMessageAfterEvent, Vector3, ItemUseBeforeEvent, Player, BlockStates } from "@minecraft/server";
import { getPlayerSession } from "../session/playerSessionRegistry";
import { DebugStickModal } from "../modals/debugStickModal";

let nextPickUse = -1;
const PICK_DELAY = 10;


function iterateBlock(arg: PlayerBreakBlockBeforeEvent) {
    if (!arg.itemStack?.typeId.startsWith("bets:debug_stick")) {
        return;
    }
    
    arg.cancel = true;
    if (system.currentTick < nextPickUse) return;
    nextPickUse = system.currentTick + PICK_DELAY;
    const player = arg.player ;
    
    const increment = !player.isSneaking;
    const session = getPlayerSession(player.name);
    
    const states = arg.block.permutation.getAllStates(); 

    let keys = Object.keys(states);
    keys.sort();

    let stateIndex =0;
    let allPosible=1;
    let mults:number[] = []
    let permutation = arg.block.permutation;
    keys.reverse();
    keys.forEach(key=> {
        let valids = BlockStates.get(key)?.validValues!;
        let valid:(number|string|boolean)[] = []
        valids.forEach(k=>valid.push(k));
        valid.sort();
        mults.push(allPosible);
        allPosible *= valid.length;

    })

    
    keys.reverse();
    mults.reverse();
    let iter=0;
    keys.forEach(key=> {       
        let valids = BlockStates.get(key)?.validValues!;  
        let valid:(number|string|boolean)[] = []
        valids.forEach(k=>valid.push(k));      
        valid.sort();
        let c = valid.indexOf(states[key]);
        stateIndex += c*mults[iter]
        iter++;
        
    });
    // world.sendMessage(""+stateIndex);

    let target = (stateIndex + (increment?1:-1)+allPosible  )%allPosible;
    iter=0;
    keys.forEach(key=> {
        let valids = BlockStates.get(key)?.validValues!;  
        let valid:(number|string|boolean)[] = []
        valids.forEach(k=>valid.push(k));      
        valid.sort();
        let c = Math.floor( target / mults[iter]);
        // world.sendMessage(JSON.stringify(
        //     {
        //         target:target,
        //         c:c,
        //         valid:valid
        //     },
        //     null,4
        // ))
        permutation = permutation.withState(key, valid[c]);
        target %= mults[iter];
        iter++;
        
    });

    system.run(()=>
    arg.block.setPermutation(permutation));
    

}


function openDebugStick(arg:ItemUseOnBeforeEvent) {
    if (!arg.itemStack?.typeId.startsWith("bets:debug_stick")) {
        return;
    }
    
    arg.cancel = true;
    if (system.currentTick < nextPickUse) return;
    nextPickUse = system.currentTick + PICK_DELAY;


    let permutation = arg.block.permutation;
    let states = permutation.getAllStates()
    if (Object.keys(states).length ===0) {
        return;
    }
    const modal = new DebugStickModal(states);
    system.run(
        ()=>modal.show(arg.source)
        .then((states)=> 
            system.run(()=>
            arg.block.setPermutation(
                BlockPermutation.resolve(arg.block.permutation.type.id, states)
            )
            )
        )
        .catch((_)=>{ })
    )
    
}

function attachDebugStickItemUse() {
    //Fixme Don't repeat yourself
    world.beforeEvents.itemUseOn.subscribe(openDebugStick);
    world.beforeEvents.playerBreakBlock.subscribe(iterateBlock);

}

export { attachDebugStickItemUse }