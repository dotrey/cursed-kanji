import LibraryIndex from "./LibraryIndex.js";
import LibraryIndexLoader from "./files/LibraryIndexLoader.js";
import LibraryBook from "./LibraryBook.js";
import LibraryBookLoader from "./files/LibraryBookLoader.js";
import LibraryIndexBookFileStructure from "./files/LibraryIndexBookFileStructure.js";
import ObjectStorage from "../../storage/ObjectStorage.js";
import Cardbox from "./Cardbox.js";
import LibraryDB from "./LibraryDB.js";

export default class Library {
    index : LibraryIndex;
    books : {[index : string] : LibraryBook} = {};
    cardbox : Cardbox;

    private enabledBooks : string[] = [];
    private unsealedBooks : string[] = [];
    private storage : ObjectStorage;

    constructor(private db : LibraryDB) {
        this.storage = new ObjectStorage(
            this, [
                {
                    name : "enabledBooks",
                    type : "array",
                    defaultValue : []
                },
                {
                    name : "unsealedBooks",
                    type : "array",
                    defaultValue : []
                }
            ], "library"
        )
        this.storage.load();
        this.cardbox = new Cardbox(db);
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
        if (this.isBookSealed(id)) {
            this.unsealBook(id);
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

    /**
     * Checks if the book with the given id is still sealed.
     * @param id 
     */
    isBookSealed(id : string) {
        return this.unsealedBooks.indexOf(id) < 0;
    }

    /**
     * Unseals the book with the given id. Unsealing a book will add all
     * the words of the book to the first slot of the cardbox.
     * Note: this also affects words with the same id from different books.
     * @param id 
     */
    unsealBook(id : string) {
        this.unsealedBooks.push(id);
        this.storage.save();
        this.getBook(id).then((book : LibraryBook) => {
            for(const word of book.words) {
                // word not yet in the cardbox
                this.cardbox.insert(word.id, 1);
            }
        });
    }
}