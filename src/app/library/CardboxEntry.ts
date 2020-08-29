export default class CardboxEntry {
    wordId : string = "";
    slot : number = 1;
    lastKnown : string = "";
    timesKnown : number = 0;
    avgInputTime : number = 0;
    
    constructor(wordId : string) {
        this.wordId = wordId;
    }
}