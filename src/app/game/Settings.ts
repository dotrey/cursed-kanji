import ObjectStorage from "../../storage/ObjectStorage.js";

export default class Settings {

    private storage : ObjectStorage;
    private settingRomajiBoardLayout : string = "";

    constructor() {
        this.storage = new ObjectStorage(this, [
            {
                name : "settingRomajiBoardLayout",
                type : "string",
                defaultValue : "aiueo-bz"
            }
        ]);
        this.storage.load();
    }

    get romajiBoardLayout() {
        return this.settingRomajiBoardLayout;
    }

    set romajiBoardLayout(value : string) {
        this.settingRomajiBoardLayout = value;
        this.storage.save();
    }
}