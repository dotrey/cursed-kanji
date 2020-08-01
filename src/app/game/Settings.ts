import ObjectStorage from "../../storage/ObjectStorage.js";

export default class Settings {

    private storage : ObjectStorage;
    private _romajiBoardLayout : string = "";
    private _romajiBoardOffsetBottom : string = "0";
    private _romajiBoardOrientaion : string = "";

    constructor() {
        this.storage = new ObjectStorage(this, [
            {
                name : "_romajiBoardLayout",
                type : "string",
                defaultValue : "aiueo-bz"
            },
            {
                name : "_romajiBoardOffsetBottom",
                type : "string",
                defaultValue : "0"
            },
            {
                name : "_romajiBoardOrientaion",
                type : "string",
                defaultValue : ""
            }
        ], "settings");
        this.storage.load();
    }

    get romajiBoardLayout() {
        return this._romajiBoardLayout;
    }

    set romajiBoardLayout(value : string) {
        this._romajiBoardLayout = value;
        this.storage.save();
    }

    get romajiBoardOffsetBottom() {
        return Number.parseInt(this._romajiBoardOffsetBottom);
    }

    set romajiBoardOffsetBottom(value : number) {
        this._romajiBoardOffsetBottom = value.toString();
        this.storage.save();
    }

    get romajiBoardOrientation() {
        return this._romajiBoardOrientaion;
    }

    set romajiBoardOrientation(value : string) {
        this._romajiBoardOrientaion = value;
        this.storage.save();
    }
}