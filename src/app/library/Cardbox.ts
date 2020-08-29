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
    slotDistribution() : Promise<number[]> {
        return new Promise<number[]>(async (resolve, reject) => {
            // this.db.objectStore(this.tableName).index()
            let r = await Promise.all([
                new Promise<number>((resolve, reject) => {
                    if (this.db.ready()) {
                        this.db.objectStore(this.tableName).index("slot").count(1).onsuccess = (ev : Event) => {
                            resolve((ev as any).target.result || 0)
                        }
                    }else{
                        resolve(0);
                    }
                }),
                new Promise<number>((resolve, reject) => {
                    if (this.db.ready()) {
                        this.db.objectStore(this.tableName).index("slot").count(2).onsuccess = (ev : Event) => {
                            resolve((ev as any).target.result || 0)
                        }
                    }else{
                        resolve(0);
                    }
                }),
                new Promise<number>((resolve, reject) => {
                    if (this.db.ready()) {
                        this.db.objectStore(this.tableName).index("slot").count(3).onsuccess = (ev : Event) => {
                            resolve((ev as any).target.result || 0)
                        }
                    }else{
                        resolve(0);
                    }
                })
            ]);
            r.unshift(r[0] + r[1] + r[2])
            resolve(r);
        });
    }

    /**
     * Returns the corruption as percentage.
     */
    async corruption() : Promise<number> {
        // slot 1 weighs double
        let dist : number[] = await this.slotDistribution();
        console.log(dist);
        let corruption : number = 0;
        if (dist[0] > 0) {
            corruption = ((dist[1] + dist[1] + dist[2]) / dist[0]) / 2;
        }
        return corruption;
    }
}