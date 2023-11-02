import { world, MolangVariableMap } from "@minecraft/server"
import { BetsCoords } from "./variables"

export default function renderSelection() {

    //FIXME: Deal with outside blocks
    let tpos1 = BetsCoords.getPos1()
    let tpos2 = BetsCoords.getPos2()


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
    if (!BetsCoords.isThereAValidWorkspace()) return;
    let pos1 = BetsCoords.getPos1()!;
    let pos2 = BetsCoords.getPos2()!;

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

    let moolang = new MolangVariableMap()
    let cornerMoolang = new MolangVariableMap()
    moolang.setFloat("scale", 0.1);
    moolang.setFloat("offset_x", 16);
    moolang.setFloat("offset_y", 0);
    cornerMoolang.setFloat("scale", 0.2);
    cornerMoolang.setFloat("offset_x", 0);
    cornerMoolang.setFloat("offset_y", 0);

    for (let x = x1 + 1; x < x2; x++) {
        try { overworld.spawnParticle("bets:select_particle", { x: x, y: y1, z: z1 }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x, y: y1, z: z2 }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x, y: y2, z: z1 }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x, y: y2, z: z2 }, moolang); } catch { }
    }

    for (let y = y1 + 1; y < y2; y++) {
        try { overworld.spawnParticle("bets:select_particle", { x: x1, y: y, z: z1 }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x1, y: y, z: z2 }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x2, y: y, z: z1 }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x2, y: y, z: z2 }, moolang); } catch { }
    }

    for (let z = z1 + 1; z < z2; z++) {
        try { overworld.spawnParticle("bets:select_particle", { x: x1, y: y1, z: z }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x2, y: y1, z: z }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x1, y: y2, z: z }, moolang); } catch { }
        try { overworld.spawnParticle("bets:select_particle", { x: x2, y: y2, z: z }, moolang); } catch { }
    }
    if ([pos1.x !== pos2.x, pos1.y !== pos2.y, pos1.z !== pos2.z].filter(Boolean).length >= 2) {
        if (pos2.x !== pos1.x) {
            try { overworld.spawnParticle("bets:select_particle", { x: pos1.x, y: pos2.y, z: pos2.z }, cornerMoolang); } catch { }
            try { overworld.spawnParticle("bets:select_particle", { x: pos2.x, y: pos1.y, z: pos1.z }, cornerMoolang); } catch { }
        }
        if (pos2.y !== pos1.y) {
            try { overworld.spawnParticle("bets:select_particle", { x: pos2.x, y: pos1.y, z: pos2.z }, cornerMoolang); } catch { }
            try { overworld.spawnParticle("bets:select_particle", { x: pos1.x, y: pos2.y, z: pos1.z }, cornerMoolang); } catch { }
        }
        if (pos2.z !== pos1.z) {
            try { overworld.spawnParticle("bets:select_particle", { x: pos2.x, y: pos2.y, z: pos1.z }, cornerMoolang); } catch { }
            try { overworld.spawnParticle("bets:select_particle", { x: pos1.x, y: pos1.y, z: pos2.z }, cornerMoolang); } catch { }
        }
    }




}