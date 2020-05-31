import m from "../Mitrhil.js";
import RomajiBoardView from "./game/RomajiboardView.js";
import RomajiProposalView from "./game/RomajiProposalView.js";

const GameView : any = {
    view(vnode : any) {
        return m(".container.game", {

        }, [
            m(RomajiProposalView, { input : vnode.attrs.game.input }),
            m(RomajiBoardView, { input : vnode.attrs.game.input })
        ]);
    }
}

export default GameView;