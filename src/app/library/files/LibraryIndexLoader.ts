import LibraryIndex from "../LibraryIndex.js";
import LibraryBook from "../LibraryBook.js";

export default class LibraryIndexLoader {

    indexFile : string = "./assets/data/index.json";

    async load() : Promise<LibraryIndex> {
        const response = await fetch(this.indexFile);
        const json = await response.json();
        let index : LibraryIndex = Object.assign(new LibraryIndex(), json);

        for (let i = 0, ic = index.books.length; i < ic; i++) {
            index.books[i] = Object.assign(new LibraryBook(), index.books[i]);
        }
        index.refreshMappings();

        return index;
    }

}