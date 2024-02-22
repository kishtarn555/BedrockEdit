import { StructureSave } from "./schemas/structure.schema";
import { db } from "./dbStringManager";

//TODO: Analyze if this requires a RAM cache to avoid fetching from disk every time


export function loadStructureRegister(identifier:string) : StructureSave | undefined {
    let entry = db.loadString(`bets:struct.s.${identifier}`,'NA')
    if (entry==='NA') {
        return undefined;
    }
    return JSON.parse(entry);
}



export function saveStructureRegister(identifier:string, structure:StructureSave) {
    try {
        let structures:string[] = loadAllStructureIdentifiers();
        structures.push(identifier);
        structures = Array.from(new Set(structures));
        db.saveString(`bets:struct.s.${identifier}`,    JSON.stringify(structure));
        db.saveString("bets:structures",                JSON.stringify(structures));
    } catch( error) {
        console.error("[ERROR]",(error as Error).stack, structure)
    }
    
}

export function loadAllStructureIdentifiers(): string[] {
    return JSON.parse(db.loadString("bets:structures","[]"));
}
