import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('filma.db');

export function initDb() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS filmas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ano INTEGER,
        titulo TEXT NOT NULL,
        genero TEXT
    );
`);
}