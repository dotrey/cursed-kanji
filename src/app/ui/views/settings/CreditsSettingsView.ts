import m from "../../Mithril.js";
import Settings from "../../../game/Settings.js";

const CreditsSettingsView : any = {
    settings : <Settings> null,
    oninit(vnode : any) {
        this.settings = vnode.attrs.settings;
    },

    view(vnode : any) {
        return m(".container.settings", [
            this.buildHeader(),
            this.buildCredits()
        ]);
    },

    buildHeader() {
        return m(".settings-header", [
            "Credits",
            m(".settings-header-back-button", {
                onclick : () => {
                    window.history.back();
                }
            })
        ])
    },

    buildCredits() {
        return m(".settings", [
            this.buildKanjiVg(),
            this.buildKanjiDic()
        ]);
    },

    buildKanjiVg() {
        return m(".settings-group", [
            m(".settings-text", [
                m(".title", "KanjiVG"),
                "Website: ",
                m("a", {
                    href : "https://kanjivg.tagaini.net/",
                    target : "_blank",
                    rel : "noopener"
                }, "kanjivg.tagaini.net"),
                m("br"),
                m("br"),
                m.trust("KanjiVG is copyright &copy; Ulrich Apel"),
                m("br"),
                "License: ",
                m("a", {
                    href : "https://creativecommons.org/licenses/by-sa/3.0/",
                    target : "_blank",
                    rel : "noopener"
                }, "CC BY-SA 3.0"),
            ])
        ])
    },

    buildKanjiDic() {
        return m(".settings-group", [
            m(".settings-text", [
                m(".title", "KANJIDIC"),
                "Website: ",
                m("a", {
                    href : "http://www.edrdg.org/wiki/index.php/KANJIDIC_Project",
                    target : "_blank",
                    rel : "noopener"
                }, "edrdg.org/wiki/index.php/KANJIDIC_Project"),
                m("br"),
                m("br"),
                m.trust("This app uses the KANJIDIC dictionary files. These files are the property of the <a href=\"http://www.edrdg.org/\" target=\"_blank\" rel=\"noopener\">Electronic Dictionary Research and Development Group</a>, and are used in conformance with the Group's <a href=\"\" target=\"_blank\" rel=\"noopener\">license</a>."),
            ])
        ])
    },


}

export default CreditsSettingsView;