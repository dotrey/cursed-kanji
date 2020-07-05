import m from "../../Mithril.js"
import LibraryWord from "../../../library/LibraryWord.js";
import SvgLoader from "../../SvgLoader.js";


const KanjiDetailView = {
    lastKanjiVG : <string> "",
    kanjiSymbols : <string[]> [],
    svgLoader : <SvgLoader> null,
    
    oncreate(vnode : any) {
        KanjiDetailView.svgLoader = vnode.attrs.svgLoader;
    },

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
                m("svg.kanjidetail-symbol", {
                    xmlns : "http://www.w3.org/2000/svg",
                    viewBox : "0 0 109 109",
                    id : "kanjidetail-svg"
                }),
                this.buildSymbols(word),
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

    buildSymbols(word : LibraryWord) {
        let me = this;
        this.kanjiSymbols = word.id.split(";");
        return m(".kanjidetail-symbols", {
            onupdate : function(vnode : any) {
                if (vnode.dom.getAttribute("data-word-id") !== word.id && vnode.dom.firstElementChild) {
                    me.selectSymbol(vnode.dom.firstElementChild, me.kanjiSymbols[0]);
                    vnode.dom.setAttribute("data-word-id", word.id);
                    console.log("new word");
                }
            }
        },[
            this.kanjiSymbols.map((symbol : string) => {
                return m("span", {
                    onclick : function() {
                        me.selectSymbol(this, symbol);
                    }
                }, m.trust("&#x" + symbol + ";"));
            })
        ]);
    },

    selectSymbol(element : HTMLElement, symbolId : string) {
        if (symbolId !== this.lastKanjiVG) {
            this.svgLoader.loadInto(symbolId, document.getElementById("kanjidetail-svg") as unknown as SVGElement);
            this.lastKanjiVG = symbolId;
            element.parentElement.querySelectorAll("span").forEach((e) => {
                e.classList.remove("selected");
            });
            element.classList.add("selected");
        }
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