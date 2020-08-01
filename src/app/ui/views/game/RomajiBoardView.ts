import m from "../../Mithril.js";

const RomajiBoardView : any = {
    orientation : "",
    layout : "aiueo",
    layouts : {
        "aiueo" : {
            // vocal and consonants in order how they appear in hiragana alphabet
            // exception: two y since it is often used in conjunction with the other chars
            vocal : "aiueo",
            consonant : "kshtcnfmyrwgzjdbpy"
        },
        "aiueo-bz" : {
            // vocal in hiragana order, consonant in roman alphabet order
            // exception: two y since it is often used in conjunction with the other chars
            vocal : "aiueo",
            consonant : "bcdfghjkmynprstwyz",
        },
        "a-z" : {
            // vocal and consonant in roman alphabet order
            // exception: two y since it is often used in conjunction with the other chars
            vocal : "aeiou",
            consonant : "bcdfghjkmynprstwyz"
        }
    },

    oncreate(vnode : any) {
        vnode.attrs.game.input.registerRomajiBoard("game-romajiboard");
        this.layout = vnode.attrs.settings.romajiBoardLayout;
        this.orientation = vnode.attrs.settings.romajiBoardOrientation;
    },

    view() {
        return m(".romajiboard" + 
            (this.orientation ? "." : "") + this.orientation
        , {
            "id" : "game-romajiboard"
        },[
            this.buildVocalPanel(),
            this.buildConsonantPanel()
        ]);
    },

    buildVocalPanel() {
        const keys : string[] = this.getVocals();
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
        const panels : string[][] = this.getConsonants();
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
    },

    getVocals() : string[] {
        return this.layouts[this.layout].vocal.split("");
    },

    getConsonants() : string[][] {
        let r : string[][] = [];
        let remaining : string = this.layouts[this.layout].consonant;
        while (remaining.length > 0) {
            let part = remaining.substr(0, Math.min(5, remaining.length));
            remaining = remaining.substr(part.length);
            let tmp = part.split("");
            while (tmp.length < 5) {
                tmp.push("");
            }
            r.push(tmp);
        }
        return r;
    }
}

export default RomajiBoardView;