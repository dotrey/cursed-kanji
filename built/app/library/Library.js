var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import LibraryIndexLoader from "./files/LibraryIndexLoader.js";
import LibraryBookLoader from "./files/LibraryBookLoader.js";
import ObjectStorage from "../../storage/ObjectStorage.js";
export default class Library {
    constructor() {
        this.books = {};
        this.enabledBooks = [];
        this.storage = new ObjectStorage(this, [
            {
                name: "enabledBooks",
                type: "array",
                defaultValue: []
            }
        ]);
        this.storage.load();
    }
    loadIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            this.index = yield (new LibraryIndexLoader()).load();
            return true;
        });
    }
    getBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.index) {
                yield this.loadIndex();
            }
            if (typeof this.books[id] === "undefined") {
                let metadata = this.index.book(id);
                if (metadata) {
                    this.books[id] = yield (new LibraryBookLoader()).load(metadata.file);
                }
            }
            return this.books[id] || null;
        });
    }
    enabledBookIds() {
        return [...this.enabledBooks];
    }
    enableBook(id) {
        if (this.enabledBooks.indexOf(id) < 0) {
            this.enabledBooks.push(id);
        }
        this.storage.save();
    }
    disableBook(id) {
        let i = this.enabledBooks.indexOf(id);
        if (i > -1) {
            this.enabledBooks.splice(i, 1);
        }
        this.storage.save();
    }
    isBookEnabled(id) {
        return this.enabledBooks.indexOf(id) > -1;
    }
    enableBookGroup(group) {
        this.storage.canSave = false;
        for (let bookId of this.index.booksOfGroup(group)) {
            this.enableBook(bookId);
        }
        this.storage.canSave = true;
        this.storage.save();
    }
    disableBookGroup(group) {
        this.storage.canSave = false;
        for (let bookId of this.index.booksOfGroup(group)) {
            this.disableBook(bookId);
        }
        this.storage.canSave = true;
        this.storage.save();
    }
    isBookGroupEnabled(group) {
        for (let bookId of this.index.booksOfGroup(group)) {
            if (!this.isBookEnabled(bookId)) {
                return false;
            }
        }
        return true;
    }
}
//# sourceMappingURL=Library.js.map