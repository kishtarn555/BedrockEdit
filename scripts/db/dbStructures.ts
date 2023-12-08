import { StructureSave } from "./schemas/structure.schema";
import { db } from "./dbStringManager";

//TODO: Analyze if this requires a RAM cache to avoid fetching from disk every time


export function loadStructureRegister(identifier:string) : StructureSave {
    return JSON.parse(db.loadString(`bets:struct.s.${identifier}`));
}



export function saveStructureRegister(identifier:string, structure:StructureSave) {
    let structures:string[] = loadAllStructureIdentifiers();
    structures.push(identifier);
    db.loadString(JSON.stringify(structure));
    db.loadString(JSON.stringify(structures));
    
}

export function loadAllStructureIdentifiers(): string[] {
    return JSON.parse(db.loadString("bets:structures"));
}
