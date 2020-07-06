var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import LibraryWord from "./LibraryWord.js";
export default class WordPool {
    constructor(library) {
        this.library = library;
        this.pool = [];
        this.correctWords = [];
        this.wrongWords = [];
    }
    fill() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pool.length = 0;
            let wordIdIndexMap = {};
            for (const bookId of this.library.enabledBookIds()) {
                const book = yield this.library.getBook(bookId);
                for (const word of book.words) {
                    if (typeof wordIdIndexMap[word.id] === "undefined") {
                        this.pool.push(word);
                        wordIdIndexMap[word.id] = this.pool.length - 1;
                    }
                    else {
                        let wordCopy = Object.assign(new LibraryWord(), this.pool[wordIdIndexMap[word.id]]);
                        for (const reading of word.reading.kun) {
                            if (wordCopy.reading.kun.indexOf(reading) < 0) {
                                wordCopy.reading.kun.push(reading);
                            }
                        }
                        for (const reading of word.reading.on) {
                            if (wordCopy.reading.on.indexOf(reading) < 0) {
                                wordCopy.reading.on.push(reading);
                            }
                        }
                        for (const meaning of word.meaning) {
                            if (wordCopy.meaning.indexOf(meaning) < 0) {
                                wordCopy.meaning.push(meaning);
                            }
                        }
                        for (const romaji of word.romaji) {
                            if (wordCopy.romaji.indexOf(romaji) < 0) {
                                wordCopy.romaji.push(romaji);
                            }
                        }
                        this.pool[wordIdIndexMap[word.id]] = wordCopy;
                    }
                }
            }
            if (!this.pool.length) {
                let word = new LibraryWord();
                word.id = "7121";
                this.pool.push(word);
                window.location.hash = "!/";
            }
            return true;
        });
    }
    clear() {
        this.pool.length = 0;
        this.activeWord = null;
        this.correctWords.length = 0;
        this.wrongWords.length = 0;
    }
    current() {
        return this.activeWord;
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pool.length) {
                yield this.fill();
            }
            const i = Math.floor(Math.random() * this.pool.length);
            this.activeWord = this.pool.splice(i, 1)[0];
            return this.activeWord;
        });
    }
    markCurrentWordCorrect() {
        if (this.activeWord && this.correctWords.indexOf(this.activeWord.id) < 0) {
            this.correctWords.push(this.activeWord.id);
        }
    }
    markCurrentWordWrong() {
        if (this.activeWord && this.wrongWords.indexOf(this.activeWord.id) < 0) {
            this.wrongWords.push(this.activeWord.id);
        }
    }
}
//# sourceMappingURL=WordPool.js.map