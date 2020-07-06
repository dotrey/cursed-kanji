import m from "../Mithril.js";
const SettingsView = {
    settings: null,
    oninit(vnode) {
        this.settings = vnode.attrs.settings;
    },
    view(vnode) {
        return m(".container.settings", [
            this.buildHeader(),
            this.buildSettings()
        ]);
    },
    buildHeader() {
        return m(".settings-header", [
            "Settings",
            this.buildHeaderBackButton()
        ]);
    },
    buildHeaderBackButton() {
        return m(".settings-header-back-button", {
            onclick: () => {
                window.history.back();
            }
        });
    },
    buildSettings() {
        return m(".settings", [
            this.buildRomajiBoardLayout()
        ]);
    },
    buildRomajiBoardLayout() {
        return m(".settings-group", [
            m(".settings-group-title", "Keyboard Layout"),
            m(".settings-option", [
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardLayout === "aiueo",
                        onchange: () => {
                            this.settings.romajiBoardLayout = "aiueo";
                        }
                    }),
                    "hiragana order"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardLayout === "aiueo-bz",
                        onchange: () => {
                            this.settings.romajiBoardLayout = "aiueo-bz";
                        }
                    }),
                    "hiragana + alphabetical order"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardLayout === "a-z",
                        onchange: () => {
                            this.settings.romajiBoardLayout = "a-z";
                        }
                    }),
                    "alphabetical order"
                ])
            ])
        ]);
    }
};
export default SettingsView;
//# sourceMappingURL=SettingsView.js.map