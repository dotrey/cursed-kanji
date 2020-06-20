import m from "../../Mithril.js"
import LibraryWord from "../../../library/LibraryWord.js";


const KanjiDetailView = {

    view(vnode : any) {
        let word = vnode.attrs.game.status.word as LibraryWord;
        if (!word) {
            return null;
        }

        return m(".kanjidetail " + (vnode.attrs.hidden ? "hidden" : ""), [
            m(".kanjidetail-close", {
                onclick : function() {
                    window.history.back();
                }
            }, m.trust("&#x2715;")),
            m(".kanjidetail-grid", [
                m(".kanjidetail-symbol"),
                m(".kanjidetail-symbols"),
                m(".kanjidetail-spacer.s1"),
                this.buildWord(word),
                m(".kanjidetail-spacer.s2"),
                this.buildReadingOn(word),
                this.buildReadingKun(word),
                m(".kanjidetail-spacer.s3"),
                this.buildMeaning(word)
            ])
        ]);
    },

    buildWord(word : LibraryWord) {
        let tmp : string[] = word.id.split(";");
        let kanji : string = "";
        for(const t of tmp) {
            kanji += "&#x" + t + ";";
        }
        return m(".kanjidetail-text.word", m.trust(kanji));
    },

    buildReadingOn(word : LibraryWord) {
        return m(".kanjidetail-text.reading-on", [
            m("b", "on reading:"),
            m("br"),
            word.reading.on.join(", ") || m.trust("&minus;")
        ]);
    },

    buildReadingKun(word : LibraryWord) {
        return m(".kanjidetail-text.reading-kun", [
            m("b", "kun reading:"),
            m("br"),
            word.reading.kun.join(", ") || m.trust("&minus;")
        ]);
    },

    buildMeaning(word : LibraryWord) {
        return m(".kanjidetail-text.meaning", [
            m("b", "meaning:"),
            m("br"),
            m.trust(word.meaning.join("<br>") || "&minus;")
        ]);
    }
};

export default KanjiDetailView;