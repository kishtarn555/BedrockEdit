import { Commit } from "./commit";


const UndoHistory:Commit[] = []

const RedoHistory:Commit[] = []

let MaxHistoryLength = 2000;
let UndoLength=0;
export default class History {

    static AddCommit(commit:Commit) {
        while (RedoHistory.length > 0) RedoHistory.pop() // Delete RedoHistory
        UndoHistory.push(commit);
        while (UndoHistory.length > MaxHistoryLength) {
            let commit = UndoHistory.shift();
            UndoLength-=commit!.changes.length;
        }
        UndoLength+=commit.changes.length;
    }

    static Undo() {
        if (UndoHistory.length === 0) return;

        UndoHistory[UndoHistory.length-1].rollback();        
        UndoLength-=UndoHistory[UndoHistory.length-1].changes.length;
        RedoHistory.push(UndoHistory.pop()!);
    }
    static Redo() {
        if (RedoHistory.length === 0) return;
        RedoHistory[RedoHistory.length-1].redo();
        UndoHistory.push(RedoHistory.pop()!);
        UndoLength+=UndoHistory[UndoHistory.length-1].changes.length;

    }
}