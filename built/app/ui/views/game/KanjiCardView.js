import m from "../../Mithril.js";
const KanjiCardView = {
    lastKanji: "",
    view(vnode) {
        let phase = vnode.attrs.game.status.phase;
        let seconds = "" + vnode.attrs.game.status.remainingSeconds;
        if (seconds.indexOf(".") < 0) {
            seconds += ".0";
        }
        return m(".kanjicard.phase-" + phase, {
            onclick: () => {
                window.location.hash = "#!/game/detail";
            }
        }, [
            m(".kanjicard-word", {
                onupdate: function (vnode) {
                    if (vnode.dom.innerText !== KanjiCardView.lastKanji) {
                        let scale = 1;
                        if (vnode.dom.offsetWidth > vnode.dom.parentNode.offsetWidth) {
                            scale = vnode.dom.parentNode.offsetWidth / vnode.dom.offsetWidth;
                        }
                        vnode.dom.setAttribute("style", "--scale:" + scale);
                        KanjiCardView.lastKanji = vnode.dom.innerText;
                    }
                }
            }, m.trust(vnode.attrs.game.status.kanji)),
            m(".kanjicard-timer", seconds),
            m(".kanjicard-details", "tap for details")
        ]);
    }
};
export default KanjiCardView;
//# sourceMappingURL=KanjiCardView.js.map