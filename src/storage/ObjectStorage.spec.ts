import { expect } from "chai";
import "mocha";
import ObjectStorage from "./ObjectStorage";

describe("Object Storage", () => {
    // create a demo object with some properties
    const storageDemo = {
        storage : <ObjectStorage> null,
        stringProperty : "hello world",
        arrayProperty : ["hello", "world"],
        objectProperty : <{[key : string]:any}> {
            a : "hello",
            b : "world"
        }
    }

    // attach the ObjectStorage to the demo object
    storageDemo.storage = new ObjectStorage(storageDemo, [
        {
            name : "stringProperty",
            type : "string",
            defaultValue : "default value"
        },
        {
            name : "arrayProperty",
            type : "array",
            defaultValue : ["default", "value"]
        },
        {
            name : "objectProperty",
            type : "object",
            defaultValue : {
                a : "default",
                b : "value"
            }
        }
    ], "storage-demo");

    it("-- test local storage mock --", () => {
        localStorage.setItem("test-item", "hi");
        expect(localStorage.getItem("test-item")).to.equal("hi");
    })

    it("has initial values", () => {
        expect(storageDemo.stringProperty).to.equal("hello world");
        expect(storageDemo.arrayProperty).to.eql(["hello", "world"]);
        expect(storageDemo.objectProperty).to.eql({a : "hello", b : "world"});
    });

    it("loads default values", () => {
        storageDemo.storage.load();
        expect(storageDemo.stringProperty).to.equal("default value");
        expect(storageDemo.arrayProperty).to.eql(["default", "value"]);
        expect(storageDemo.objectProperty).to.eql({a : "default", b : "value"});
    });

    it("saves and loads new values", () => {
        storageDemo.stringProperty = "new world";
        storageDemo.arrayProperty = ["new", "world"];
        storageDemo.objectProperty = { a : "new", b : "world", c : "!"};

        storageDemo.storage.save();
        expect(storageDemo.stringProperty).to.equal("new world");
        expect(storageDemo.arrayProperty).to.eql(["new", "world"]);
        expect(storageDemo.objectProperty).to.eql({a : "new", b : "world", c : "!"});

        expect(localStorage.getItem(storageDemo.storage.storagePrefix + "storage-demo-stringProperty"))
            .to.equal("new world");
        expect(localStorage.getItem(storageDemo.storage.storagePrefix + "storage-demo-arrayProperty"))
        .to.equal(JSON.stringify(storageDemo.arrayProperty));
        expect(localStorage.getItem(storageDemo.storage.storagePrefix + "storage-demo-objectProperty"))
        .to.equal(JSON.stringify(storageDemo.objectProperty));

        storageDemo.storage.load();
        expect(storageDemo.stringProperty).to.equal("new world");
        expect(storageDemo.arrayProperty).to.eql(["new", "world"]);
        expect(storageDemo.objectProperty).to.eql({a : "new", b : "world", c : "!"});
    });

    it("can load to any object", () => {
        const secondObject = {
            storage : <ObjectStorage> null,
            stringProperty : <string> "",
            arrayProperty : <any[]> [],
            objectProperty : <{[key : string]:any}> {}
        };

        secondObject.storage = new ObjectStorage(secondObject, [
            {
                name : "stringProperty",
                type : "string",
                defaultValue : "default value"
            },
            {
                name : "arrayProperty",
                type : "array",
                defaultValue : ["default", "value"]
            },
            {
                name : "objectProperty",
                type : "object",
                defaultValue : {
                    a : "default",
                    b : "value"
                }
            }
        ], "storage-demo")

        secondObject.storage.load();
        expect(secondObject.stringProperty).to.equal("new world");
        expect(secondObject.arrayProperty).to.eql(["new", "world"]);
        expect(secondObject.objectProperty).to.eql({a : "new", b : "world", c : "!"});
    });
});