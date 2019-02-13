import { ArbiterModuleMetadata, ArbiterModuleCache } from '../types';

export function openCache(dbName: string, tableName = 'modules'): ArbiterModuleCache {
  const w = window as any;
  const indexedDb: IDBFactory = w.indexedDB || w.mozIndexedDB || w.webkitIndexedDB || w.msIndexedDB;
  const { READ_WRITE = 'readwrite' } = w.IDBTransaction ||
    w.webkitIDBTransaction ||
    w.msIDBTransaction || {
      READ_WRITE: 'readwrite',
    };
  const loadDb = new Promise<IDBDatabase>(resolve => {
    if (indexedDb) {
      const req = indexedDb.open(dbName, 1);
      req.onerror = () => {
        console.warn(`A problem occurred while reading the cache.`, req.error);
        resolve(undefined);
      };
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = () => {
        const db = req.result;
        const table = db.createObjectStore(tableName, { keyPath: 'name' });
        table.createIndex('hash', 'hash', { unique: false });
      };
    } else {
      resolve(undefined);
    }
  });

  return {
    update(cachedModules, receivedModules) {
      return loadDb.then(db => {
        if (db) {
          return new Promise<Array<ArbiterModuleMetadata>>(resolve => {
            const table = db.transaction([tableName], READ_WRITE).objectStore(tableName);
            const updates: Array<ArbiterModuleMetadata> = [];
            const result = receivedModules.map(receivedModule => {
              const [item] = cachedModules.filter(m => m.name === receivedModule.name);

              if (!item || item.hash !== receivedModule.hash) {
                updates.push(receivedModule);
                return receivedModule;
              }

              return item;
            });
            const updater = () => {
              const updatedModule = updates.pop();

              if (updatedModule) {
                table.put(updatedModule).onsuccess = updater;
              } else {
                resolve(result);
              }
            };

            updater();
          });
        }

        return receivedModules;
      });
    },
    retrieve() {
      return loadDb.then(db => {
        if (db) {
          return new Promise<Array<ArbiterModuleMetadata>>(resolve => {
            const cachedModules: Array<ArbiterModuleMetadata> = [];
            const table = db.transaction([tableName]).objectStore(tableName);
            const req = table.openCursor();
            req.onsuccess = () => {
              const cursor = req.result;

              if (cursor) {
                cachedModules.push(cursor.value);
                cursor.continue();
              } else {
                resolve(cachedModules);
              }
            };
          });
        }

        return [];
      });
    },
  };
}
