import LibraryDB from "./LibraryDB.js";
import CardboxEntry from "./CardboxEntry.js";

export default class Cardbox {
    readonly maxSlots : number = 3;
    private tableName : string = "tbl_cardbox";

    constructor(private db : LibraryDB) {
    }

    insert(wordId : string, slot : number) {
        let card = new CardboxEntry(wordId);
        card.slot = slot;
        this.db.objectStore(this.tableName, "readwrite").add(card);
    }

    moveUp(wordId : string, time : number = 0) {
        let objStore = this.db.objectStore(this.tableName, "readwrite");
        objStore.get(wordId).onsuccess = (ev : Event) => {
            let card = ((ev as any).target.result || new CardboxEntry(wordId)) as CardboxEntry;
            let today : string = (new Date()).toLocaleDateString();
            if (card.lastKnown === today) {
                // already improved today, can't move up until tomorrow
                return;
            }
            card.lastKnown = today;
            let totalTime : number = card.avgInputTime * card.timesKnown;
            totalTime += time;
            card.timesKnown++;
            card.avgInputTime = totalTime / card.timesKnown;
            card.slot = Math.min(card.slot + 1, this.maxSlots);
            objStore.put(card);
        }
    }

    moveDown(wordId : string) {
        // moving down always moves the word to the first slot
        let objStore = this.db.objectStore(this.tableName, "readwrite");
        objStore.get(wordId).onsuccess = (ev : Event) => {
            let card = ((ev as any).target.result || new CardboxEntry(wordId)) as CardboxEntry;
            card.slot = 1;
            objStore.put(card);
        }
    }

    async whichSlot(wordId : string) : Promise<number> {
        return new Promise<number>((resolve, reject) => {
            let objStore = this.db.objectStore(this.tableName, "readonly");
            objStore.get(wordId).onsuccess = (ev : Event) => {
                let card = (ev as any).target.result as CardboxEntry;
                resolve(card ? card.slot : 0);
            }
        })
    }

    /**
     * Returns an array with the count of words in the different slots:
     * [
     *  <total count>, <count slot 1>, <count slot 2>, <count slot 3>
     * ]
     */
    slotDistribution() : number[] {
        let n : number[] = [0,
            0,
            0,
            0
        ];
        n[0] = n[1] + n[2] + n[3];
        return n;
    }

    /**
     * Returns the corruption as percentage.
     */
    corruption() : number {
        // slot 1 weighs double
        let dist : number[] = this.slotDistribution();
        let total : number = dist[0] + dist[1];
        let corruption : number = 0;
        if (dist[1] + dist[2] > 0) {
            corruption = total / (dist[1] + dist[1] + dist[2]);
        }
        return corruption;
    }
}