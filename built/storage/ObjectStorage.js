export default class ObjectStorage {
    constructor(o, attributes = []) {
        this.prefix = "cursedkanji-1-";
        this.canSave = true;
        this.attributes = [];
        this.object = o;
        this.attributes = attributes;
        try {
            this.storage = window.localStorage;
        }
        catch (e) {
        }
    }
    save() {
        if (!this.canSave) {
            return;
        }
        for (let attr of this.attributes) {
            if (typeof this.object[attr.name] !== "undefined") {
                this.store(attr.name, this.object[attr.name]);
            }
        }
    }
    load() {
        for (let attr of this.attributes) {
            if (typeof this.object[attr.name] !== "undefined") {
                switch (attr.type) {
                    case "string":
                        this.object[attr.name] = this.get(attr.name, attr.defaultValue);
                        break;
                    case "array":
                        this.object[attr.name] = this.getObject(attr.name, attr.defaultValue);
                        break;
                    case "object":
                        this.object[attr.name] = this.getArray(attr.name, attr.defaultValue);
                        break;
                }
            }
        }
    }
    store(key, value) {
        if (!this.storage) {
            return;
        }
        if (typeof value !== "string") {
            value = JSON.stringify(value);
        }
        this.storage.setItem(this.prefix + key, value);
    }
    get(key, defaultValue = "") {
        if (!this.storage) {
            return defaultValue;
        }
        return this.storage.getItem(this.prefix + key) || defaultValue;
    }
    getObject(key, defaultValue = {}) {
        if (!this.storage) {
            return defaultValue;
        }
        let value = this.storage.getItem(this.prefix + key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }
    getArray(key, defaultValue = []) {
        if (!this.storage) {
            return defaultValue;
        }
        let value = this.storage.getItem(this.prefix + key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }
}
//# sourceMappingURL=ObjectStorage.js.map