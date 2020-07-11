import StorageAttribute from "./StorageAttribute.js";

export default class ObjectStorage {

    private prefix : string = "cursedkanji-1-"

    // Can be used to temporarily disable saving
    canSave : boolean = true;

    private storage : Storage;
    private object : any;
    private objectId : string = "";
    private attributes : StorageAttribute[] = [];

    constructor(o : any, attributes : StorageAttribute[] = [], objectId : string = "") {
        this.object = o;
        this.attributes = attributes;
        this.objectId = (objectId ?? "") + "-";
        try {
            this.storage = localStorage;
        }catch(e){
            // some privacy browse modes throw an exception when attempting to access local storage
        }
    }

    save() {
        if (!this.canSave) {
            return;
        }
        for(let attr of this.attributes) {
            if (typeof this.object[attr.name] !== "undefined") {
                this.store(attr.name, this.object[attr.name]);
            }
        }
    }

    load() {
        for(let attr of this.attributes) {
            if (typeof this.object[attr.name] !== "undefined") {
                switch(attr.type) {
                    case "string":
                        this.object[attr.name] = this.get(attr.name, attr.defaultValue);
                        break;
                    case "array":
                        this.object[attr.name] = this.getArray(attr.name, attr.defaultValue);
                        break;
                    case "object":
                        this.object[attr.name] = this.getObject(attr.name, attr.defaultValue);
                        break;
                }
            }
        }
    }

    store(key : string, value : any) {
        if (!this.storage) {
            return;
        }
        if (typeof value !== "string") {
            value = JSON.stringify(value);
        }
        this.storage.setItem(this.prefix + this.objectId + key, value);
    }

    get(key : string, defaultValue : string = "") : string{
        if (!this.storage) {
            return defaultValue;
        }
        return this.storage.getItem(this.prefix + this.objectId + key) || defaultValue;
    }

    getObject(key : string, defaultValue : {[index : string] : any} = {}) : {[index : string] : any} {
        if (!this.storage) {
            return defaultValue;
        }
        let value : string = this.storage.getItem(this.prefix + this.objectId + key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }

    getArray(key : string, defaultValue : any[] = []) : any[] {
        if (!this.storage) {
            return defaultValue;
        }
        let value : string = this.storage.getItem(this.prefix + this.objectId + key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }

    get storagePrefix() {
        return this.prefix;
    }
}