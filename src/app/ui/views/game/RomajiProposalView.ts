import m from "../../Mithril.js";

const RomajiProposalView : any = {
    oncreate(vnode : any) {
        vnode.attrs.input.registerRomajiProposal("game-romaji-proposal");
    },

    view(vnode : any) {
        return m(".romaji-proposal", {
            "id" : "game-romaji-proposal"
        },[
            m(".romaji-proposal-text", {
                onupdate : function(vnode : any) {
                    if (vnode.dom.scrollWidth > vnode.dom.offsetWidth) {
                        // text is too long
                        let currentSize : number = parseInt(vnode.dom.style.fontSize || 100);
                        let resize = (function(e : any, size : number) {
                            return function() {
                                size--;
                                e.style.fontSize = size + "%";
                                if (e.scrollWidth > e.offsetWidth && size > 1) {
                                    window.requestAnimationFrame(resize);
                                }
                            }
                        })(vnode.dom, currentSize);
                        resize();
                    }else{
                        let currentSize : number = parseInt(vnode.dom.style.fontSize || 100);
                        vnode.dom.style.fontSize = currentSize + "%";
                    }
                }
            }, vnode.attrs.input.proposedText),

            m(".romaji-proposal-undo", m.trust("&larr;")),
            m(".romaji-proposal-clear", m.trust("&times;"))
        ])
    }
}

export default RomajiProposalView;