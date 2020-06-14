import m from "../Mithril.js";
import RomajiBoardView from "./game/RomajiboardView.js";
import RomajiProposalView from "./game/RomajiProposalView.js";
import KanjiCardView from "./game/KanjiCardView.js";

const GameView : any = {
    oncreate(vnode : any) {
        vnode.attrs.game.start();
    },

    view(vnode : any) {
        return m(".container.game", {

        }, [
            m(KanjiCardView, { game : vnode.attrs.game }),
            m(RomajiProposalView, { game : vnode.attrs.game }),
            m(RomajiBoardView, { game : vnode.attrs.game })
        ]);
    }
}
export default GameView;

export const render : () => void = function() {
    m.redraw();
}
