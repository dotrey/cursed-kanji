import DBMigration1 from "./dbmigrations/DBMigration1";

export default class LibraryDB {

    readonly dbName : string = "cursedkanjidb"
    readonly dbVersion : number = 1;

    private db : IDBDatabase;

    constructor() {
        let request = indexedDB.open(this.dbName, this.dbVersion);
        request.onerror = (ev : Event) => {
            console.log("IndexedDB not available");
        }
        request.onsuccess = (ev : Event) => {
            this.db = (ev as any).target.result as IDBDatabase;
        }
        request.onupgradeneeded = (ev : IDBVersionChangeEvent) => {
            let db : IDBDatabase = (ev as any).target.result as IDBDatabase;
            let version : number = ev.oldVersion || 0;
            if (version === 0) {
                // migrate to version 1
                DBMigration1.migrate(db);
            }
        }
    }

    objectStore(store : string, mode : "readwrite" | "readonly" = "readonly") {
        return this.db.transaction(store, mode).objectStore(store);
    }
}