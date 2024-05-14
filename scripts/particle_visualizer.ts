import { world, MolangVariableMap, Vector3, system } from "@minecraft/server"
import { PlayerSession } from "./session/playerSession";


const offset = 0.45;
const animationSpeed = 5;
const animationLength = 5;

function getLineMoolang(x:number,y:number,z:number,offset_x:number) :MolangVariableMap{

    let moolang = new MolangVariableMap()
    moolang.setFloat("x", x);    
    moolang.setFloat("y", y);    
    moolang.setFloat("z", z);
    moolang.setFloat("offset_x", offset_x);
    moolang.setFloat("scale_x", offset_x==0?0.5:0.15);
    moolang.setFloat("scale_y", offset_x==0?0.15:0.5);    
    return moolang;
}

function spawnLine(coords:Vector3, x:number, y:number, z:number, offset_x:number) {
    
    let overworld = world.getDimension("overworld");
    try { overworld.spawnParticle("bets:select_line_particle", coords, getLineMoolang(x,y,z,offset_x)); } catch {  }
    try { overworld.spawnParticle("bets:select_line_particle", coords, getLineMoolang(-x,-y,-z,offset_x)); } catch { }
}

function shouldShowParticle(l:number, x:number, r:number) {
    if (r-l <=3) return true;
    if (l === x || r === x) return true;
    return ((x-l)%animationLength ===0)
    
}

export default function renderSelection(session:PlayerSession) {

    //FIXME: Deal with outside blocks
    let tpos1 = session.selection.getMainAnchor()?.location
    let tpos2 =  session.selection.getSecondaryAnchor()?.location


    let pos2Moolang = new MolangVariableMap()
    let pos1Moolang = new MolangVariableMap()
    pos1Moolang.setFloat("scale", 0.4);
    pos1Moolang.setFloat("offset_x", 0);
    pos1Moolang.setFloat("offset_y", 16);

    pos2Moolang.setFloat("scale", 0.4);
    pos2Moolang.setFloat("offset_x", 16);
    pos2Moolang.setFloat("offset_y", 16);
    let overworld = world.getDimension("overworld");

    if (tpos1 != null) {
        try {
            overworld.spawnParticle(
                "bets:select_particle",
                {
                    x: Math.floor(tpos1.x) + 0.5,
                    y: Math.floor(tpos1.y) + 0.5,
                    z: Math.floor(tpos1.z) + 0.5
                },
                pos1Moolang
            );
        } catch { }
    }
    if (tpos2 != null) {
        try {
            overworld.spawnParticle(
                "bets:select_particle",
                {
                    x: Math.floor(tpos2.x) + 0.5,
                    y: Math.floor(tpos2.y) + 0.5,
                    z: Math.floor(tpos2.z) + 0.5
                },
                pos2Moolang
            );
        } catch { }
    }
    if (!session.hasValidWorkspace()) return;
    // console.warn("yes?");
    let pos1 = session.selection.getMainAnchorBlockLocation()!;
    let pos2 = session.selection.getSecondaryAnchorBlockLocation()!;

    pos1 = {
        x: Math.floor(pos1.x) + 0.5,
        y: Math.floor(pos1.y) + 0.5,
        z: Math.floor(pos1.z) + 0.5
    };
    pos2 = {
        x: Math.floor(pos2.x) + 0.5,
        y: Math.floor(pos2.y) + 0.5,
        z: Math.floor(pos2.z) + 0.5
    };
    let x1 = Math.min(pos1.x, pos2.x);
    let x2 = Math.max(pos1.x, pos2.x);

    let y1 = Math.min(pos1.y, pos2.y);
    let y2 = Math.max(pos1.y, pos2.y);

    let z1 = Math.min(pos1.z, pos2.z);
    let z2 = Math.max(pos1.z, pos2.z);

    let length = (x2 - x1 + 1) + (y2 - y1 + 1) + (z2 - z1 + 1)

    let cornerMoolang = new MolangVariableMap()
    cornerMoolang.setFloat("scale", 0.2);
    cornerMoolang.setFloat("offset_x", 0);
    cornerMoolang.setFloat("offset_y", 0);
    for (let x = x1; x <= x2; x++) {
        if (shouldShowParticle(x1,x,x2)) {
            spawnLine( { x: x, y: y1-offset, z: z1-offset },1,0,0,0);
            spawnLine( { x: x, y: y2+offset, z: z2+offset },1,0,0,0);
            spawnLine( { x: x, y: y1-offset, z: z2+offset },1,0,0,0);
            spawnLine( { x: x, y: y2+offset, z: z1-offset },1,0,0,0);
        }
    }

    for (let y = y1; y <= y2; y++) {
        if (shouldShowParticle(y1,y,y2)) {
            spawnLine({ x: x1-offset, y: y, z: z1-offset }, 1,0,0,16);
            spawnLine({ x: x2+offset, y: y, z: z2+offset }, 1,0,0,16);        
            spawnLine({ x: x1-offset, y: y, z: z2+offset }, 1,0,0,16);
            spawnLine({ x: x2+offset, y: y, z: z1-offset }, 1,0,0,16);
        }
    }

    for (let z = z1; z <= z2; z++) {
        if (shouldShowParticle(z1,z,z2)) {
            spawnLine( { x: x1-offset, y: y1-offset, z: z },0,0,1,0);
            spawnLine( { x: x2+offset, y: y2+offset, z: z },0,0,1,0);
            spawnLine( { x: x2+offset, y: y1-offset, z: z },0,0,1,0);
            spawnLine( { x: x1-offset, y: y2+offset, z: z },0,0,1,0);
        }
    }
    // if ([pos1.x !== pos2.x, pos1.y !== pos2.y, pos1.z !== pos2.z].filter(Boolean).length >= 2) {
    //     // if (pos2.x !== pos1.x) {
    //         try { overworld.spawnParticle("bets:select_particle", { x: pos1.x-offset, y: pos2.y+offset, z: pos2.z+offset }, cornerMoolang); } catch { }
    //         try { overworld.spawnParticle("bets:select_particle", { x: pos2.x-offset, y: pos1.y+offset, z: pos1.z+offset }, cornerMoolang); } catch { }
    //     // }
    //     // if (pos2.y !== pos1.y) {
    //         try { overworld.spawnParticle("bets:select_particle", { x: pos2.x+offset, y: pos1.y-offset, z: pos2.z+offset }, cornerMoolang); } catch { }
    //         try { overworld.spawnParticle("bets:select_particle", { x: pos1.x-offset, y: pos2.y+offset, z: pos1.z-offset }, cornerMoolang); } catch { }
    //     // }
    //     // if (pos2.z !== pos1.z) {
    //         try { overworld.spawnParticle("bets:select_particle", { x: pos2.x+offset, y: pos2.y+offset, z: pos1.z-offset }, cornerMoolang); } catch { }
    //         try { overworld.spawnParticle("bets:select_particle", { x: pos1.x-offset, y: pos1.y-offset, z: pos2.z+offset }, cornerMoolang); } catch { }
    //     // }
    // }




}