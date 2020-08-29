import DBMigration1 from "./dbmigrations/DBMigration1.js";

export default class LibraryDB {

    readonly dbName : string = "cursedkanjidb"
    readonly dbVersion : number = 1;

    private db : IDBDatabase;

    constructor() {}

    initialize() : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = (ev : Event) => {
                console.log("IndexedDB not available");
                resolve(false);
            }
            request.onsuccess = (ev : Event) => {
                this.db = (ev as any).target.result as IDBDatabase;
                resolve(true);
            }
            request.onupgradeneeded = (ev : IDBVersionChangeEvent) => {
                let db : IDBDatabase = (ev as any).target.result as IDBDatabase;
                let version : number = ev.oldVersion || 0;
                if (version === 0) {
                    // migrate to version 1
                    DBMigration1.migrate(db);
                }
            }
        });
    }

    objectStore(store : string, mode : "readwrite" | "readonly" = "readonly") : IDBObjectStore {
        return this.db.transaction(store, mode).objectStore(store);
    }

    ready() : boolean {
        return !!this.db;
    }
}