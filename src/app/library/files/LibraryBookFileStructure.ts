export default interface LibraryBookFileStructure {
    /**
     * The unique id of the book.
     */
    id : string;

    /**
     * The visible name of the book.
     */
    name : string;

    /**
     * All the words contained in this book. The order is defined by the order
     * in this array.
     */
    words : {
        /**
         * The ids of the characters forming the word, which are the unicodes 
         * in hex of the symbols. If the unicode has less than 5 characters, it
         * will be left-padded with 0.
         */
        id : string[];

        /**
         * The romaji (transcription with latin characters) of the word. There can
         * be multiple, all of them will be accepted when comparing with the input.
         * The romaji are not displayed, but the reading (see below).
         */
        romaji : string[];

        /**
         * The reading of the kanji in hiragana for kun yomi and katakana for on yomi.
         * These readings are displayed as provided, maintaining order.
         */
        reading : {
            on? : string[],
            kun? : string[]
        };

        /**
         * The meaning of the word. These values will be displayed as provided, maintaining
         * the given order.
         */
        meaning? : string[];
    }[];
}