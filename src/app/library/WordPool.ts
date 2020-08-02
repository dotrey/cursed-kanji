import LibraryWord from "./LibraryWord.js";
import Library from "./Library.js";

export default class WordPool {

    private activeWord : LibraryWord;
    private pool : LibraryWord[] = [];
    private correctWords : string[] = [];
    private wrongWords : string[] = [];

    constructor(private library : Library) {

    }

    /**
     * Fills the pool with words from the books enabled in the library.
     */
    async fill() : Promise<boolean> {
        let slotCount : number[] = [0, 0, 0, 0];
        this.pool.length = 0;
        let wordIdIndexMap : {[index : string] : number} = {};
        for(const bookId of this.library.enabledBookIds()) {
            const book = await this.library.getBook(bookId);
            
            for(const word of book.words) {
                if (typeof wordIdIndexMap[word.id] === "undefined") {
                    // First occurence of this word
                    this.pool.push(word);
                    wordIdIndexMap[word.id] = this.pool.length - 1;
                }else{
                    // The same word is already in the pool. But, since the same word
                    // can have different readings/meanings depending on the context of
                    // the book, we have to merge the existing word with the new one
                    
                    // First, create a copy of the word from the one already in the pool
                    // (we don't want to modify the original word from neither book)
                    let wordCopy : LibraryWord = Object.assign(new LibraryWord(), this.pool[wordIdIndexMap[word.id]]);

                    // Now, add any additional readings/meanings/romaji
                    for(const reading of word.reading.kun) {
                        if (wordCopy.reading.kun.indexOf(reading) < 0) {
                            wordCopy.reading.kun.push(reading);
                        }
                    }
                    for(const reading of word.reading.on) {
                        if (wordCopy.reading.on.indexOf(reading) < 0) {
                            wordCopy.reading.on.push(reading);
                        }
                    }
                    for(const meaning of word.meaning) {
                        if (wordCopy.meaning.indexOf(meaning) < 0) {
                            wordCopy.meaning.push(meaning);
                        }
                    }
                    for(const romaji of word.romaji) {
                        if (wordCopy.romaji.indexOf(romaji) < 0) {
                            wordCopy.romaji.push(romaji);
                        }
                    }

                    // Replace the original word with the merged copy
                    this.pool[wordIdIndexMap[word.id]] = wordCopy;
                }

                // count the words for each cardbox slot
                let slot = this.library.cardbox.whichSlot(word.id);
                if (slot < 1) {
                    // new word
                    this.library.cardbox.insert(word.id, 1);
                    slot = 1;
                }
                slotCount[slot]++;
            }
        }
        if (!this.pool.length) {
            // no active books
            // -> place one filler and redirect to main
            let word = new LibraryWord();
            word.id = "7121";
            this.pool.push(word);
            window.location.hash = "!/";
            return true;
        }

        // The pool now contains all words from all active books. For a better learning
        // effect, spaced repetition is utilized with 3 slots:
        // - words in slot 1 (yes, not 0-based) are always repeated and thus always in the pool
        // - words in slot 2 are repeated every second time, thus only half of them (random) should be in the current pool
        // - words in slot 3 are repeated every fourth time, thus only a quarter of them (random) should be in the pool
        // To achieve this, the number of words per slot were counted while collecting the words.
        // Now, the pool gets shuffled and then looped over, counting the words per slot. After the limits for slot 2 and 3
        // are reached, each word encountered for these slots are removed from the pool to achieve a 100%/50%/25% distribution.
        // Exceptions:
        // - When there are no words in slot 1, slot 2 will be 100% and slot 3 will be 50%
        // - When there are no words in slot 1 and slot 2, slot 3 will be 100%
        this.shuffle();
        if (slotCount[1] > 0 && slotCount[2] > 0) {
            let limit2 : number = Math.ceil(slotCount[2] / 2);
            let count2 : number = 0;
            let limit3 : number = Math.ceil(slotCount[3] / 4);
            let count3 : number = 0;
            if (slotCount[1] < 1) {
                limit2 = slotCount[2];
                limit3 = Math.ceil(slotCount[3] / 2);
            }
            let i : number = 0;
            while (i < this.pool.length) {
                let slot = this.library.cardbox.whichSlot(this.pool[i].id);
                if ((slot === 2 && count2 >= limit2) ||
                    (slot === 3 && count3 >= limit3)) {
                    // word of slot 2 or 3, but limit is reached
                    // -> remove
                    this.pool.splice(i, 1);
                }else{
                    if (slot === 2) {
                        count2++;
                    }else if (slot === 3) {
                        count3++;
                    }
                    i++;
                }
            }
        }

        return true;
    }

    shuffle() {
        for (let i = this.pool.length - 1; i > 0; i--) {
            let n = Math.floor(Math.random() * (i + 1));
            let tmp = this.pool[i];
            this.pool[i] = this.pool[n];
            this.pool[n] = tmp;
        }
    }

    clear() {
        this.pool.length = 0;
        this.activeWord = null;
        this.correctWords.length = 0;
        this.wrongWords.length = 0;
    }

    /**
     * Returns the currently active word.
     */
    current() : LibraryWord {
        return this.activeWord;
    }

    /**
     * Removes a random word from the pool and returns it.
     * If the pool is empty it will be refilled.
     */
    async next() : Promise<LibraryWord> {
        if (!this.pool.length) {
            // pool is empty, refill
            await this.fill();
        }

        const i : number = Math.floor(Math.random() * this.pool.length);
        this.activeWord = this.pool.splice(i, 1)[0];

        return this.activeWord;
    }

    /**
     * Marks the current word as correct, meaning the player
     * knew the current word -> will be used to sort the word
     * in a cardbox system, that allows focusing on words the
     * player struggles with.
     */
    markCurrentWordCorrect() {
        if (this.activeWord) {
            this.library.cardbox.moveUp(this.activeWord.id);
        }
    }

    /**
     * Marks the current word as wrong, meaning the player didn't
     * know the current word -> will be used to sort the word
     * in a cardbox system, that allows focusing on words the
     * player struggles with.
     */
    markCurrentWordWrong() {
        if (this.activeWord) {
            this.library.cardbox.moveDown(this.activeWord.id);
        }
    }
}