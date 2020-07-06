import m from "../../Mithril.js";
const RomajiBoardView = {
    layout: "aiueo",
    layouts: {
        "aiueo": {
            vocal: "aiueo",
            consonant: "kshtcnfmyrwgzjdbpy"
        },
        "aiueo-bz": {
            vocal: "aiueo",
            consonant: "bcdfghjkmynprstwyz",
        },
        "a-z": {
            vocal: "aeiou",
            consonant: "bcdfghjkmynprstwyz"
        }
    },
    oncreate(vnode) {
        vnode.attrs.game.input.registerRomajiBoard("game-romajiboard");
        this.layout = vnode.attrs.settings.romajiBoardLayout;
    },
    view() {
        return m(".romajiboard", {
            "id": "game-romajiboard"
        }, [
            this.buildVocalPanel(),
            this.buildConsonantPanel()
        ]);
    },
    buildVocalPanel() {
        const keys = this.getVocals();
        return m(".romajiboard-scrollrow", m(".romajiboard-panel", {}, keys.map((k) => {
            return this.buildKey(k);
        })));
    },
    buildConsonantPanel() {
        const panels = this.getConsonants();
        return m(".romajiboard-scrollrow", {
            "data-scrollable": "1",
            "style": "top: var(--panel-height);"
        }, [
            panels.map((keys, i) => {
                return m(".romajiboard-panel", {
                    "style": "left: " + (i * 100) + "vw;"
                }, keys.map((key) => {
                    return this.buildKey(key);
                }));
            })
        ]);
    },
    buildKey(key) {
        return m(".romajiboard-key", {
            "data-key": key
        }, key);
    },
    getVocals() {
        return this.layouts[this.layout].vocal.split("");
    },
    getConsonants() {
        let r = [];
        let remaining = this.layouts[this.layout].consonant;
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
};
export default RomajiBoardView;
//# sourceMappingURL=RomajiboardView.js.map