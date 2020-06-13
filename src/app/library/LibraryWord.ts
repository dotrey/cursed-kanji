export default class LibraryWord {
    id: string[] = []; 
    romaji: string[] = []; 
    reading: { 
        on: string[]; 
        kun: string[]; 
    } = { on : [], kun : []};
    meaning: string[] = [];
}