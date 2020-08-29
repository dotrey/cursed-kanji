# Table Structures

## tbl_groups
- id : string : The unique group id, e.g. "cursed-kanji"
- name : string : The visible name of the group
- displayOrder : number : The relative order to other groups, sorts ascending

## tbl_books
- id : string : The unique book id, e.g. "cursed-hiragana"
- groupId : string : The id of the group this book belongs to
- wordCount : number : The number of words inside this book
- color : string : The color (hex format) of the book's cover
- name : string : The visible name of the book
- displayOrder : number : The relative order to other books of the same group, sorts ascending
- updatedAt : string : Date+Time of the last update of any word inside the book or the book itself
- sealed : boolean : Indicator whether the book is still sealed or not, default true
- active : boolean : Indicator whether the word of the book shall be used for training or not, default false

## tbl_words
- id : string : The unique id of the word. This is a combination of the book's id and the word's id (thus the same word but in different books have different ids)
- wordId : string : The word id, consisting of the unicodes of the word's characters (0-padded to 5 chars). There can be multiple words with the same wordId
- bookId : string : The id of the book this word belongs to
- romaji : string[] : The romajis of the word
- reading : {on : string[], kun : string[]} : The different readings of the word
- meaning : string[] : The meanings of the word

## tbl_cardbox
- wordId : string : The id of a word
- slot : number : The slot the word is in. Note that slots start at 1
- lastKnown : string : The date (d.m.Y) when the word was marked "known" the last time
- timesKnown : number : A counter how often the user successfully knew the word
- avgInputTime : number : The average seconds the user needs to know the word