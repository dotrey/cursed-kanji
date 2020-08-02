import TestView from "./views/TestView.js";
import m from "./Mithril.js";
import CursedKanji from "../../CursedKanji.js";
import GameView from "./views/GameView.js";
import MainView from "./views/MainView.js";
import LibraryView from "./views/LibraryView.js";
import SettingsView from "./views/SettingsView.js";
import SvgLoader from "./SvgLoader.js";
import KeyboardSettingsView from "./views/settings/KeyboardSettingsView.js";
import CreditsSettingsView from "./views/settings/CreditsSettingsView.js";
import SealView from "./views/SealView.js";

export default class Ui {
    private svgLoader : SvgLoader;

    constructor(private cursed : CursedKanji) {
        this.setup();
    }

    private setup() {
        this.svgLoader = new SvgLoader();

        let me = this;
        m.route(document.body, "/", {
            "/" : {
                render : function() {
                    return m(MainView, {
                        cursed : me.cursed
                    });
                }
            },
            "/sealed" : {
                render : function() {
                    return m(SealView, {
                        cursed : me.cursed
                    });
                }
            },
            "/settings/keyboard" : {
                render : function() {
                    return m(KeyboardSettingsView, {
                        settings : me.cursed.settings
                    });
                }
            },
            "/settings/credits" : {
                render : function() {
                    return m(CreditsSettingsView, {
                        settings : me.cursed.settings
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
            "/game:overlay..." : {
                render : function(vnode : any) {
                    return m(GameView, {
                        overlay : vnode.attrs.overlay,
                        game : me.cursed.game,
                        settings : me.cursed.settings,
                        svgLoader : me.svgLoader
                    });
                }
            },
            "/test" : TestView
        });
    }
}