import m from "../Mithril.js";
import RomajiBoardView from "./game/RomajiboardView.js";
import RomajiProposalView from "./game/RomajiProposalView.js";
import KanjiCardView from "./game/KanjiCardView.js";
import KanjiDetailView from "./game/KanjiDetailView.js";
const GameView = {
    detailOverlay: false,
    oncreate(vnode) {
        vnode.attrs.game.start();
    },
    onremove(vnode) {
        vnode.attrs.game.stop();
    },
    onupdate(vnode) {
        let detail = this.detailOverlay;
        this.detailOverlay = vnode.attrs.overlay === "/detail";
        if (this.detailOverlay !== detail) {
            if (this.detailOverlay) {
                vnode.attrs.game.pause();
                m.redraw();
            }
            else {
                vnode.attrs.game.resume();
            }
        }
    },
    view(vnode) {
        return m(".container.game", {}, [
            m(".game-back-button", {
                onclick: function () {
                    window.history.back();
                }
            }),
            m(KanjiCardView, {
                game: vnode.attrs.game
            }),
            m(RomajiProposalView, {
                game: vnode.attrs.game
            }),
            m(RomajiBoardView, {
                game: vnode.attrs.game,
                settings: vnode.attrs.settings
            }),
            m(KanjiDetailView, {
                game: vnode.attrs.game,
                svgLoader: vnode.attrs.svgLoader,
                hidden: !this.detailOverlay
            })
        ]);
    }
};
export default GameView;
export const render = function () {
    m.redraw();
};
//# sourceMappingURL=GameView.js.map