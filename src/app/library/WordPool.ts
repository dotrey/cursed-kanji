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
        this.pool.length = 0;
        let wordIdIndexMap : {[index : string] : number}= {};
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
            }
        }
        console.log(this.pool);
        return true;
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
        if (this.activeWord && this.correctWords.indexOf(this.activeWord.id) < 0) {
            this.correctWords.push(this.activeWord.id);
        }
    }

    /**
     * Marks the current word as wrong, meaning the player didn't
     * know the current word -> will be used to sort the word
     * in a cardbox system, that allows focusing on words the
     * player struggles with.
     */
    markCurrentWordWrong() {
        if (this.activeWord && this.wrongWords.indexOf(this.activeWord.id) < 0) {
            this.wrongWords.push(this.activeWord.id);
        }
    }
}