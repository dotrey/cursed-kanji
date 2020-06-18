import TestView from "./views/TestView.js";
import m from "./Mithril.js";
import CursedKanji from "../../CursedKanji.js";
import GameView from "./views/GameView.js";
import MainView from "./views/MainView.js";
import LibraryView from "./views/LibraryView.js";
import SettingsView from "./views/SettingsView.js";

export default class Ui {
    constructor(private cursed : CursedKanji) {
        this.setup();
    }

    private setup() {
        let me = this;
        m.route(document.body, "/", {
            "/" : {
                render : function() {
                    return m(MainView, {
                        cursed : me.cursed
                    });
                }
            },
            "/settings" : {
                render : function() {
                    return m(SettingsView, {
                        settings : me.cursed.settings
                    });
                }
            },
            "/library" : {
                render : function() {
                    return m(LibraryView, {
                        library : me.cursed.library
                    });
                }
            },
            "/game" : {
                render : function() {
                    return m(GameView, {
                        game : me.cursed.game,
                        settings : me.cursed.settings
                    });
                }
            },
            "/test" : TestView
        });
    }
}