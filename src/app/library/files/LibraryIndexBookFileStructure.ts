/**
 * The structure of a book in the library index
 */
export default interface LibraryIndexBookFileStructure {
    /**
     * Internally used id of the book, must be unique.
     */
    id : string,

    /**
     * The file containing the book, relative from the folder with the
     * index file.
     */
    file : string,

    /**
     * The name of the book, will be displayed in the library.
     */
    name : string,

    /**
     * The amount of words in the book. This is a placeholder so
     * we don't have to load each book for this information.
     */
    _wordCount : number,

    /**
     * This tag can be used to reference a group to assign the 
     * book to the group. Group can be empty
     */
    group : string
}