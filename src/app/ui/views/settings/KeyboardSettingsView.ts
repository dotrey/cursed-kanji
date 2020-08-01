import m from "../../Mithril.js";
import Settings from "../../../game/Settings.js";
import RomajiBoardView from "../game/RomajiboardView.js";

const KeyboardSettingsView : any = {
    settings : <Settings> null,
    oninit(vnode : any) {
        this.settings = vnode.attrs.settings;
    },

    oncreate() {
        this.updateRomajiBoard();
    },

    view(vnode : any) {
        return m(".container.settings", [
            this.buildHeader(),
            this.buildSettings()
        ]);
    },

    buildHeader() {
        return m(".settings-header", [
            "Settings: Keyboard",
            m(".settings-header-back-button", {
                onclick : () => {
                    window.history.back();
                }
            })
        ])
    },

    buildSettings() {
        return m(".settings", [
            this.buildRomajiBoardLayout(),
            this.buildRomajiBoardPosition(),
            this.buildRomajiBoardPreview()
        ]);
    },

    buildRomajiBoardLayout() {
        return m(".settings-group", [
            m(".settings-group-title", "Keyboard Layout"),
            m(".settings-option", [
                m("label.settings-option-name", [
                    m("input", {
                        type : "checkbox",
                        checked : this.settings.romajiBoardLayout === "aiueo",
                        onchange : () => {
                            this.settings.romajiBoardLayout = "aiueo";
                            this.updateRomajiBoard();
                        }
                    }),
                    "hiragana order"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type : "checkbox",
                        checked : this.settings.romajiBoardLayout === "aiueo-bz",
                        onchange : () => {
                            this.settings.romajiBoardLayout = "aiueo-bz";
                            this.updateRomajiBoard();
                        }
                    }),
                    "hiragana + alphabetical order"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type : "checkbox",
                        checked : this.settings.romajiBoardLayout === "a-z",
                        onchange : () => {
                            this.settings.romajiBoardLayout = "a-z";
                            this.updateRomajiBoard();
                        }
                    }),
                    "alphabetical order"
                ])
            ])
        ]);
    },

    buildRomajiBoardPosition() {
        let me = this;
        return m(".settings-group", {
            style : "margin-bottom: 55vw;"
        }, [
            m(".settings-group-title", "Keyboard Position"),
            m(".settings-option", [
                m("label.settings-option-name", [
                    m("input", {
                        type : "range",
                        min : "0",
                        max : "18",
                        step : "1",
                        value : "" + this.settings.romajiBoardOffsetBottom,
                        oninput : function(){
                            me.settings.romajiBoardOffsetBottom = this.value;
                            me.updateRomajiBoard();
                        }
                    }),
                    "distance bottom: " + this.settings.romajiBoardOffsetBottom
                ])
            ]),
            m(".settings-option", [
                m("label.settings-option-name", [
                    m("input", {
                        type : "checkbox",
                        checked : this.settings.romajiBoardOrientation === "romaji-board-orientation-left",
                        onchange : () => {
                            this.settings.romajiBoardOrientation = "romaji-board-orientation-left";
                            this.updateRomajiBoard();
                        }
                    }),
                    "left"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type : "checkbox",
                        checked : this.settings.romajiBoardOrientation === "",
                        onchange : () => {
                            this.settings.romajiBoardOrientation = "";
                            this.updateRomajiBoard();
                        }
                    }),
                    "stretch"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type : "checkbox",
                        checked : this.settings.romajiBoardOrientation === "romaji-board-orientation-right",
                        onchange : () => {
                            this.settings.romajiBoardOrientation = "romaji-board-orientation-right";
                            this.updateRomajiBoard();
                        }
                    }),
                    "right"
                ])
            ])
        ])
    },

    buildRomajiBoardPreview() {
        return m(".container.game", {
            style : "position: fixed; top: unset; height: auto; background: none; pointer-events: none; --bottom-space:" + this.settings.romajiBoardOffsetBottom + "vw;"
        }, 
            this.buildRomajiBoardStub()
        )
    },

    buildRomajiBoardStub() {
        return m(RomajiBoardView, {
            settings : this.settings,
            game : {
                input : {
                    registerRomajiBoard() {}
                }
            }
        })
    },

    updateRomajiBoard() {
        let e = document.getElementById("game-romajiboard");
        if (e) {
            let me = this;
            m.mount(e.parentElement, {
                view() {
                    return me.buildRomajiBoardStub();
                }
            });
        }
    }
}

export default KeyboardSettingsView;