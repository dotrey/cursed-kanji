import m from "../Mithril.js";
import Settings from "../../game/Settings.js";
import CursedKanji from "../../../CursedKanji.js";

const SettingsView : any = {
    settings : <Settings> null,
    oninit(vnode : any) {
        this.settings = vnode.attrs.settings;
    },

    view(vnode : any) {
        return m(".container.settings", [
            this.buildHeader(),
            this.buildSettings()
        ]);
    },

    buildHeader() {
        return m(".settings-header", [
            "Settings",
            this.buildHeaderBackButton()
        ])
    },

    buildHeaderBackButton() {
        return m(".settings-header-back-button", {
                onclick : () => {
                    window.history.back();
                }
            });
    },

    buildSettings() {
        return m(".settings", [
            this.buildGameSettings(),
            this.buildAbout()
        ]);
    },

    buildGameSettings() {
        return m(".settings-group", [
            m(".settings-group-title", "Game Settings"),
            m(".settings-button.more", {
                onclick : function() {
                    window.location.hash = "#!/settings/keyboard"
                }
            }, "Keyboard Settings")
        ])
    },

    buildAbout() {
        return m(".settings-group", [
            m(".settings-group-title", "About"),
            m(".settings-button.more", {
                onclick : function() {
                    window.location.hash = "#!/settings/credits"
                }
            }, "Credits"),
            m(".settings-footer-text", "version " + CursedKanji.version)
        ])
    }
}

export default SettingsView;