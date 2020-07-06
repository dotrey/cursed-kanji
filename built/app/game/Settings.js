import ObjectStorage from "../../storage/ObjectStorage.js";
export default class Settings {
    constructor() {
        this.settingRomajiBoardLayout = "";
        this.storage = new ObjectStorage(this, [
            {
                name: "settingRomajiBoardLayout",
                type: "string",
                defaultValue: "aiueo-bz"
            }
        ]);
        this.storage.load();
    }
    get romajiBoardLayout() {
        return this.settingRomajiBoardLayout;
    }
    set romajiBoardLayout(value) {
        this.settingRomajiBoardLayout = value;
        this.storage.save();
    }
}
//# sourceMappingURL=Settings.js.map