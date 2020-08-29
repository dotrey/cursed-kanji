import Ui from "./app/ui/Ui.js";
import Game from "./app/game/Game.js";
import Library from "./app/library/Library.js";
import WordPool from "./app/library/WordPool.js";
import Settings from "./app/game/Settings.js";
import LibraryDB from "./app/library/LibraryDB.js";

export default class CursedKanji {

    static version : string = "0.5";

    ui : Ui;
    game : Game;
    library : Library;
    libraryDB : LibraryDB;
    wordPool : WordPool;
    settings : Settings;

    constructor() {
        this.build();
    }

    private build() {
        this.libraryDB = new LibraryDB();
        this.library = new Library(this.libraryDB);
        this.wordPool = new WordPool(this.library);
        this.game = new Game(this.wordPool);
        this.settings = new Settings();
        this.ui = new Ui(this);
    }
}