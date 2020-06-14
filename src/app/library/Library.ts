import LibraryIndex from "./LibraryIndex.js";
import LibraryIndexLoader from "./files/LibraryIndexLoader.js";
import LibraryBook from "./LibraryBook.js";
import LibraryBookLoader from "./files/LibraryBookLoader.js";
import LibraryIndexBookFileStructure from "./files/LibraryIndexBookFileStructure.js";
import ObjectStorage from "../../storage/ObjectStorage.js";

export default class Library {
    index : LibraryIndex;
    books : {[index : string] : LibraryBook} = {};

    private enabledBooks : string[] = [];
    private storage : ObjectStorage;

    constructor() {
        this.storage = new ObjectStorage(
            this, [
                {
                    name : "enabledBooks",
                    type : "array",
                    defaultValue : []
                }
            ]
        )
        this.storage.load();
    }

    /**
     * Loads the index.json with an overview of all books.
     */
    async loadIndex() : Promise<boolean> {
        this.index = await (new LibraryIndexLoader()).load();
        return true;
    }

    /**
     * Loads and returns the book with the given id.
     * Note that books are cached, so only the initial call will cause the library to read
     * the book's file.
     * @param id 
     */
    async getBook(id : string) : Promise<LibraryBook> {
        if (!this.index) {
            await this.loadIndex();
        }
        if (typeof this.books[id] === "undefined") {
            let metadata : LibraryIndexBookFileStructure = this.index.book(id);
            if (metadata) {
                this.books[id] = await (new LibraryBookLoader()).load(metadata.file);
            }
        }
        return this.books[id] || null;
    }

    /**
     * Returns a list of all enabled books (by id).
     */
    enabledBookIds() {
        return [...this.enabledBooks];
    }

    /**
     * Enables the book with the given id and stores the list of enabled
     * book ids to the localstorage.
     * @param id 
     */
    enableBook(id : string) {
        if (this.enabledBooks.indexOf(id) < 0) {
            this.enabledBooks.push(id);
        }
        this.storage.save()
    }

    /**
     * Disables the book with the given id and stores the list of enabled
     * book ids to the localstorage.
     * @param id 
     */
    disableBook(id : string) {
        let i : number = this.enabledBooks.indexOf(id);
        if (i > -1) {
            this.enabledBooks.splice(i, 1);
        }
        this.storage.save()
    }

    /**
     * Checks whether the book with the given id is enabled or not.
     * @param id 
     */
    isBookEnabled(id : string) {
        return this.enabledBooks.indexOf(id) > -1;
    }

    /**
     * Enables all books of the given group and stores the list of enabled
     * book ids to the localstorage.
     * @param group 
     */
    enableBookGroup(group : string) {
        this.storage.canSave = false;
        for (let bookId of this.index.booksOfGroup(group)) {
            this.enableBook(bookId);
        }
        this.storage.canSave = true;
        this.storage.save();
    }

    /**
     * Disables all books of the given group and stores the list of enabled
     * book ids to the localstorage.
     * @param group 
     */
    disableBookGroup(group : string) {
        this.storage.canSave = false;
        for (let bookId of this.index.booksOfGroup(group)) {
            this.disableBook(bookId);
        }
        this.storage.canSave = true;
        this.storage.save();
    }

    /**
     * Checks if a group is enabled, which is true if all books of the group
     * are enabled.
     * @param group 
     */
    isBookGroupEnabled(group : string) {
        for (let bookId of this.index.booksOfGroup(group)) {
            if (!this.isBookEnabled(bookId)) {
                return false;
            }
        }
        return true;
    }
}