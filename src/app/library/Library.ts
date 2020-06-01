import LibraryIndex from "./LibraryIndex.js";
import LibraryIndexLoader from "./files/LibraryIndexLoader.js";
import LibraryBook from "./LibraryBook.js";
import LibraryBookLoader from "./files/LibraryBookLoader.js";
import LibraryIndexBookFileStructure from "./files/LibraryIndexBookFileStructure.js";

export default class Library {
    index : LibraryIndex;
    books : {[index : string] : LibraryBook} = {};

    private enabledBooks : string[] = [];

    async loadIndex() : Promise<boolean> {
        this.index = await (new LibraryIndexLoader()).load();
        return true;
    }

    async getBook(id : string) : Promise<LibraryBook> {
        if (typeof this.books[id] === "undefined") {
            let metadata : LibraryIndexBookFileStructure = this.index.book(id);
            if (metadata) {
                this.books[id] = await (new LibraryBookLoader()).load(metadata.file);
            }
        }
        return this.books[id] || null;
    }

    enableBook(id : string) {
        if (this.enabledBooks.indexOf(id) < 0) {
            this.enabledBooks.push(id);
        }
    }

    disableBook(id : string) {
        let i : number = this.enabledBooks.indexOf(id);
        if (i > -1) {
            this.enabledBooks.splice(i, 1);
        }
    }

    isBookEnabled(id : string) {
        return this.enabledBooks.indexOf(id) > -1;
    }

    enableBookGroup(group : string) {
        for (let bookId of this.index.booksOfGroup(group)) {
            this.enableBook(bookId);
        }
    }

    disableBookGroup(group : string) {
        for (let bookId of this.index.booksOfGroup(group)) {
            this.disableBook(bookId);
        }
    }

    isBookGroupEnabled(group : string) {
        for (let bookId of this.index.booksOfGroup(group)) {
            if (!this.isBookEnabled(bookId)) {
                return false;
            }
        }
        return true;
    }
}