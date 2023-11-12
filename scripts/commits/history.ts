import { Commit } from "./commit";


const UndoHistory:Commit[] = []

const RedoHistory:Commit[] = []

let MaxHistoryLength = 20000;
let UndoLength=0;
export default class History {

    static AddCommit(commit:Commit) {
        if (commit.inHistory === true) {
            return;
        }
        commit.inHistory=true;
        while (RedoHistory.length > 0) RedoHistory.pop() // Delete RedoHistory
        UndoHistory.push(commit);
        while (UndoLength > MaxHistoryLength) {
            let commit = UndoHistory.shift();
            UndoLength-=commit!.changes.length;
            commit!.inHistory=false;
        }
        UndoLength+=commit.changes.length;
    }

    static Undo() {
        if (UndoHistory.length === 0) return null;

        UndoHistory[UndoHistory.length-1].rollback();        
        UndoLength-=UndoHistory[UndoHistory.length-1].changes.length;        
        RedoHistory.push(UndoHistory.pop()!);
        return RedoHistory[RedoHistory.length-1]
    }
    static Redo() {
        if (RedoHistory.length === 0) return null;
        RedoHistory[RedoHistory.length-1].redo();
        UndoLength+=RedoHistory[RedoHistory.length-1].changes.length;
        UndoHistory.push(RedoHistory.pop()!);
        return UndoHistory[UndoHistory.length-1]

    }

    static getLength() {
        return UndoLength;
    }

    static getCapacity() {
        return MaxHistoryLength;
    }
}