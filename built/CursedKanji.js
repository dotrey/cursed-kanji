import Ui from "./app/ui/Ui.js";
import Game from "./app/game/Game.js";
import Library from "./app/library/Library.js";
import WordPool from "./app/library/WordPool.js";
import Settings from "./app/game/Settings.js";
export default class CursedKanji {
    constructor() {
        this.build();
    }
    build() {
        this.library = new Library();
        this.wordPool = new WordPool(this.library);
        this.game = new Game(this.wordPool);
        this.settings = new Settings();
        this.ui = new Ui(this);
    }
}
//# sourceMappingURL=CursedKanji.js.map