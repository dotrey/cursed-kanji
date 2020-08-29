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
        this.prepare().then(() => {
            this.build();
        })
    }

    private async prepare() : Promise<boolean> {
        let success : boolean = true;
        this.libraryDB = new LibraryDB();
        success = success && await this.libraryDB.initialize();
        return success;
    }

    private build() {
        this.library = new Library(this.libraryDB);
        this.wordPool = new WordPool(this.library);
        this.game = new Game(this.wordPool);
        this.settings = new Settings();
        this.ui = new Ui(this);
    }
}