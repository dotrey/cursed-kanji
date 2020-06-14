import Ui from "./app/ui/Ui.js";
import Game from "./app/game/Game.js";
import Library from "./app/library/Library.js";
import WordPool from "./app/library/WordPool.js";

export default class CursedKanji {

    ui : Ui;
    game : Game;
    library : Library;
    wordPool : WordPool;

    constructor() {
        this.build();
    }

    private build() {
        this.library = new Library();
        this.wordPool = new WordPool(this.library);
        this.game = new Game(this.wordPool);
        this.ui = new Ui(this);
    }
}