import LibraryBook from "../LibraryBook.js";

export default class LibraryBookLoader {

    basePath : string = "./assets/data/";

    async load(file : string) : Promise<LibraryBook> {
        if (file.length && file.substr(0, 1) === "/") {
            file = file.substr(1);
        }
        const response = await fetch(this.basePath + file);
        const json = await response.json();
        return Object.assign(new LibraryBook(), json);
    }

}