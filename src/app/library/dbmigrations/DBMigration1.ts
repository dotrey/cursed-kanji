export default class DBMigration1 {
    static migrate(db : IDBDatabase) {
        DBMigration1.createTblCardbox(db);
    }

    private static createTblCardbox(db : IDBDatabase) {
        let objectStore : IDBObjectStore = db.createObjectStore("tbl_cardbox", { keyPath : "wordId" });
        // create an index on the slot number for quick retrieval
        objectStore.createIndex("slot", "slot", { unique : false });
        // also create index on timesKnown and avgInputTime for statistical uses
        objectStore.createIndex("timesKnown", "timesKnown", { unique : false });
        objectStore.createIndex("avgInputTime", "avgInputTime", { unique : false });
    }
}