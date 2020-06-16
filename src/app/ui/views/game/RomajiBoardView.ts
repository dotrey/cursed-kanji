import m from "../../Mithril.js";

const RomajiBoardView : any = {
    oncreate(vnode : any) {
        vnode.attrs.game.input.registerRomajiBoard("game-romajiboard");
    },

    view() {
        return m(".romajiboard", {
            "id" : "game-romajiboard"
        },[
            this.buildVocalPanel(),
            this.buildConsonantPanel()
        ]);
    },

    buildVocalPanel() {
        const keys : string[] = [
            "a", "i", "u", "e", "o"
        ];
        return m(".romajiboard-scrollrow",
            m(".romajiboard-panel", {
                
                }, 
                keys.map((k) => {
                    return this.buildKey(k);
                })
            )
        );
    },

    buildConsonantPanel() {
        const panels : string[][] = [
            [
                "k", "s", "t", "c", "h",
            ],
            [
                "n", "f", "m", "y", "r"
            ],
            [
                "w", "g", "d", "b", "p"
            ],
            [
                "y", "z", "j", "c", "h"
            ]
        ];
        return m(".romajiboard-scrollrow", {
                "data-scrollable" : "1",
                "style" : "top: var(--panel-height);"
            },[
                panels.map((keys, i) => {
                    return m(".romajiboard-panel", {
                            "style" : "left: " + (i * 100) + "vw;"
                        },                
                        keys.map((key) => {
                            return this.buildKey(key);
                        })
                    );
                })
            ]
        );
    },

    buildKey(key : string) {
        return m(".romajiboard-key", {
            "data-key" : key
        }, key);
    }
}

export default RomajiBoardView;