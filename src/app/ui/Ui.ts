import TestView from "./views/TestView.js";
import m from "./Mitrhil.js";
import CursedKanji from "../../CursedKanji.js";
import GameView from "./views/GameView.js";

export default class Ui {
    constructor(private cursed : CursedKanji) {
        this.setup();
    }

    private setup() {
        let me = this;
        m.route(document.body, "/", {
            "/" : {
                render : function() {
                    return m(GameView, {
                        game : me.cursed.game
                    });
                }
            },
            "/test" : TestView
        });
    }
}