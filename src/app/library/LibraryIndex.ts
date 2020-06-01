import LibraryIndexFileStructure from "./files/LibraryIndexFileStructure.js";
import LibraryIndexBookFileStructure from "./files/LibraryIndexBookFileStructure.js";
import LibraryBook from "./LibraryBook.js";

export default class LibraryIndex implements LibraryIndexFileStructure {
    version: number = 0;
    books: LibraryBook[] = [];
    groups : {[index : string] : string} = {};

    private bookMap : {[index: string] : LibraryBook} = {};
    private groupBookMapping : {[index : string] : string[]} = {};

    /**
     * Returns the index version of the book, which usually does not
     * contain the words.
     * @param id 
     */
    book(id : string) : LibraryBook {
        if (typeof this.bookMap[id] !== "undefined") {
            return this.bookMap[id];
        }
        return null;
    }

    booksOfGroup(group : string) : string[] {
        if (typeof this.groupBookMapping[group] !== "undefined") {
            return this.groupBookMapping[group];
        }
        return [];
    }

    refreshMappings() {
        this.refreshBookMapping();
        this.refreshGroupBookMapping();
    }

    private refreshBookMapping() {
        this.bookMap = {};
        for (let book of this.books) {
            this.bookMap[book.id] = book;
        }
    }

    private refreshGroupBookMapping() {
        for (let book of this.books) {
            if (typeof this.groupBookMapping[book.group] === "undefined") {
                this.groupBookMapping[book.group] = [];
            }
            this.groupBookMapping[book.group].push(book.id);
        }
    }
}