import Ui from "./app/ui/Ui.js";
import Game from "./app/game/Game.js";

export default class CursedKanji {

    ui : Ui;
    game : Game;

    constructor() {
        this.build();
    }

    private build() {
        this.game = new Game();
        this.ui = new Ui(this);
    }
}