import Ui from "./app/ui/Ui.js";
import Game from "./app/game/Game.js";
import Library from "./app/library/Library.js";
import WordPool from "./app/library/WordPool.js";
import Settings from "./app/game/Settings.js";

export default class CursedKanji {

    ui : Ui;
    game : Game;
    library : Library;
    wordPool : WordPool;
    settings : Settings;

    constructor() {
        this.build();
    }

    private build() {
        this.library = new Library();
        this.wordPool = new WordPool(this.library);
        this.game = new Game(this.wordPool);
        this.settings = new Settings();
        this.ui = new Ui(this);
    }
}