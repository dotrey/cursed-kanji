import m from "../Mithril.js";
import RomajiBoardView from "./game/RomajiboardView.js";
import RomajiProposalView from "./game/RomajiProposalView.js";
import KanjiCardView from "./game/KanjiCardView.js";
import KanjiDetailView from "./game/KanjiDetailView.js";

const GameView : any = {
    detailOverlay : false,

    oncreate(vnode : any) {
        vnode.attrs.game.start();
    },

    onremove(vnode : any) {
        vnode.attrs.game.stop();
    },

    onupdate(vnode : any) {
        let detail = this.detailOverlay;
        this.detailOverlay = vnode.attrs.overlay === "/detail";
        if (this.detailOverlay !== detail) {
            // value has changed
            if (this.detailOverlay) {
                // pause game when overlay is shown
                vnode.attrs.game.pause();
                // we need to redraw once, since we paused the game loop
                // and thus the rendering
                m.redraw();
            }else{
                // resume game when overlay isn't shown
                vnode.attrs.game.resume();
            }
        }
    },

    view(vnode : any) {
        return m(".container.game", {

        }, [
            m(KanjiCardView, { 
                game : vnode.attrs.game 
            }),
            m(RomajiProposalView, { 
                game : vnode.attrs.game 
            }),
            m(RomajiBoardView, { 
                game : vnode.attrs.game, 
                settings : vnode.attrs.settings
            }),
            m(KanjiDetailView, {
                game : vnode.attrs.game,
                hidden : !this.detailOverlay
            })
        ]);
    }
}
export default GameView;

export const render : () => void = function() {
    m.redraw();
}
