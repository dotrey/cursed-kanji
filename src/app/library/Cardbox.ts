import ObjectStorage from "../../storage/ObjectStorage.js";

export default class Cardbox {
    private slot1 : string[] = [];
    private rawSlot1 : string = "";
    private slot2 : string[] = [];
    private rawSlot2 : string = "";
    private slot3 : string[] = [];
    private rawSlot3 : string = "";
    private slots : string[][] = [];
    private improvedToday : string[] = [];
    private storage : ObjectStorage;

    constructor() {
        this.storage = new ObjectStorage(this, [
            {
                name : "rawSlot1",
                type : "string",
                defaultValue : ""
            },
            {
                name : "rawSlot2",
                type : "string",
                defaultValue : ""
            },
            {
                name : "rawSlot3",
                type : "string",
                defaultValue : ""
            },
            {
                name : "improvedToday",
                type : "array",
                defaultValue : []
            }
        ], "cardbox");
        this.loadSlots();
    }

    insert(wordId : string, slot : number) {
        for (let i = 0; i < 3; i++) {
            if (i + 1 === slot) {
                this.addWordToSlot(wordId, this.slots[i]);
            }else{
                this.removeWordFromSlot(wordId, this.slots[i]);
            }
        }
        this.saveSlots();
    }

    moveUp(wordId : string) {
        if (!this.canImproveWord(wordId)) {
            // each word can only move up once per day
            return;
        }
        const currentSlot : number = this.whichSlot(wordId);
        if (currentSlot + 1 <= 3) {
            this.insert(wordId, currentSlot + 1);
        }
        this.markWordImproved(wordId);
    }

    moveDown(wordId : string) {
        // moving down always moves the word to the first slot
        this.insert(wordId, 1);
    }

    whichSlot(wordId : string) : number {
        for (let i = 0; i < 3; i++) {
            if (this.slots[i].indexOf(wordId) > -1) {
                return i + 1;
            }
        }
        return 0;
    }

    /**
     * Returns an array with the count of words in the different slots:
     * [
     *  <total count>, <count slot 1>, <count slot 2>, <count slot 3>
     * ]
     */
    slotDistribution() : number[] {
        let n : number[] = [0,
            this.slot1.length,
            this.slot2.length,
            this.slot3.length
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

    private canImproveWord(wordId : string) : boolean {
        // each word can only improve once
        return this.improvedToday.indexOf(wordId) < 0;
    }

    private markWordImproved(wordId : string) {
        // improvedToday is an array of strings, where the first entry is
        // always the date
        let today : string = (new Date()).toLocaleDateString();
        if (this.improvedToday.length < 1) {
            // array is empty
            this.improvedToday.push(today);
        }else if (this.improvedToday[0] !== today) {
            // array not empty, but first entry is not today
            // -> new day, reset the array
            this.improvedToday.length = 0;
            this.improvedToday.push(today);
        }
        this.improvedToday.push(wordId);
        this.storage.save();
    }

    private removeWordFromSlot(wordId : string, slot : string[]) {
        let i : number = slot.indexOf(wordId);
        if (i > -1) {
            slot.splice(i, 1);
        }
    }

    private addWordToSlot(wordId : string, slot : string[]) {
        let i : number = slot.indexOf(wordId);
        if (i < 0) {
            slot.push(wordId);
        }
    }

    private loadSlots() {
        this.storage.load();
        this.slot1 = this.deserialize(this.rawSlot1);
        this.slot2 = this.deserialize(this.rawSlot2);
        this.slot3 = this.deserialize(this.rawSlot3);
        this.slots = [
            this.slot1, this.slot2, this.slot3
        ];
    }

    private saveSlots() {
        this.rawSlot1 = this.serialize(this.slot1);
        this.rawSlot2 = this.serialize(this.slot2);
        this.rawSlot3 = this.serialize(this.slot3);
        this.storage.save();
    }

    private serialize(values : string[]) : string {
        // for serialization, convert the ids of the words back into the actual characters
        // -> requires less space to save
        return values.reduce((serialized : string, value : string) : string => {
            if (serialized.length) {
                serialized += ";"
            }

            serialized += value.split(";").reduce((word : string, charcode : string) : string => {
                word += String.fromCharCode(parseInt("0x" + charcode));                
                return word;
            }, "");

            return serialized;
        }, "");
    }

    private deserialize(value : string) : string[] {
        // for deserialization, convert the characters back to unicode hex and make sure they are
        // 0-padded to 5 chars -> char "id"
        // if there were multiple characters in the serialized word, concatenate the char ids
        // with ";" as separator to get the word id
        return value.split(";").map((words : string) => {
            return words.split("").map((word : string) => {
                let tmp : string = word.charCodeAt(0).toString(16);
                while (tmp.length < 5) {
                    tmp = "0" + tmp;
                }
                return tmp;
            }).join(";");
        }).filter((value : string) => {
            // remove empty strings
            return !!value;
        });

    }
}