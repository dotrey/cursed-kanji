import LibraryIndexBookFileStructure from "./LibraryIndexBookFileStructure.js";

export default interface LibraryIndexFileStructure {
    /**
     * The version of the file structure.
     */
    version : number;

    /**
     * The books available in the library. Whether the content of a single
     * book represents a real book or only a chapter of a real book doesn't 
     * matter. Books serve as logical grouping for words.
     * Books will be displayed in the order defined in the books array
     */
    books : LibraryIndexBookFileStructure[];

    /**
     * Groups can be used to organize the books. The index is the id of the
     * group that can be used by books to reference it. The value is the 
     * visible name of the group.
     */
    groups : { [index : string] : string };
}