import m from "../../Mithril.js"


const KanjiCardView = {
    lastKanji : "",
    view(vnode : any) {
        let phase : string = vnode.attrs.game.status.phase;
        let seconds : string = "" + vnode.attrs.game.status.remainingSeconds;
        if (seconds.indexOf(".") < 0) {
            seconds += ".0";
        }
        return [
            m(".kanjicard.phase-" + phase, {            
                onclick : () => {
                    window.location.hash = "#!/game/detail";
                }
            }, [
                m(".kanjicard-word", {
                    onupdate : function(vnode : any) {
                        if (vnode.dom.innerText !== KanjiCardView.lastKanji) {
                            let scale : number = 1;
                            if (vnode.dom.offsetWidth > vnode.dom.parentNode.offsetWidth) {
                                scale = vnode.dom.parentNode.offsetWidth / vnode.dom.offsetWidth;
                            }
                            vnode.dom.setAttribute("style", "--scale:" + scale);
                            KanjiCardView.lastKanji = vnode.dom.innerText;
                        }
                    }
                }, m.trust(vnode.attrs.game.status.kanji)),
                m(".kanjicard-timer", seconds),
                m(".kanjicard-details", "tap for details"),
            ]),
            m(".kanjicard-solution.phase-" + phase, [
                vnode.attrs.game.status.word ?
                m.trust(vnode.attrs.game.status.word.romaji.reduce((a : string, c : string) => {
                    if (a) {
                        a += "<br>";
                    }
                    return a + c;
                }), "") :
                ""
            ])
        ];
    }
};

export default KanjiCardView;