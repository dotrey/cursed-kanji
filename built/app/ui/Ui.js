import TestView from "./views/TestView.js";
import m from "./Mithril.js";
import GameView from "./views/GameView.js";
import MainView from "./views/MainView.js";
import LibraryView from "./views/LibraryView.js";
import SettingsView from "./views/SettingsView.js";
import SvgLoader from "./SvgLoader.js";
export default class Ui {
    constructor(cursed) {
        this.cursed = cursed;
        this.setup();
    }
    setup() {
        this.svgLoader = new SvgLoader();
        let me = this;
        m.route(document.body, "/", {
            "/": {
                render: function () {
                    return m(MainView, {
                        cursed: me.cursed
                    });
                }
            },
            "/settings": {
                render: function () {
                    return m(SettingsView, {
                        settings: me.cursed.settings
                    });
                }
            },
            "/library": {
                render: function () {
                    return m(LibraryView, {
                        library: me.cursed.library
                    });
                }
            },
            "/game:overlay...": {
                render: function (vnode) {
                    return m(GameView, {
                        overlay: vnode.attrs.overlay,
                        game: me.cursed.game,
                        settings: me.cursed.settings,
                        svgLoader: me.svgLoader
                    });
                }
            },
            "/test": TestView
        });
    }
}
//# sourceMappingURL=Ui.js.map