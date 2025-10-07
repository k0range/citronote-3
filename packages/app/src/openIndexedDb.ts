import { openDB } from "idb";
import type { IDBPDatabase, DBSchema } from "idb";
import type { NotebookMetadata } from "core/notebooks";

interface MyDB extends DBSchema {
  notebooks: {
    key: string;
    value: NotebookMetadata;
  };
}

let dbPromise: Promise<IDBPDatabase<MyDB>> | null = null;

export const openIndexedDb = () => {
  if (!dbPromise) {
    dbPromise = openDB<MyDB>("citronote-db", 1, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore("notebooks", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
};

export type IDB = IDBPDatabase<MyDB>;
