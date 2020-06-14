import m from "../../Mithril.js"


const KanjiCardView = {
    view(vnode : any) {
        let phase : string = vnode.attrs.game.status.phase;
        let seconds : string = "" + vnode.attrs.game.status.remainingSeconds;
        if (seconds.indexOf(".") < 0) {
            seconds += ".0";
        }
        return m(".kanjicard.phase-" + phase, [
            m(".kanjicard-word", m.trust(vnode.attrs.game.status.kanji)),
            m(".kanjicard-timer", seconds)
        ]);
    }
};

export default KanjiCardView;