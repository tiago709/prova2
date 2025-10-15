import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('filmes.db');

export function initDb() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS filme (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ano INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        genero TEXT NOT NULL
    );
`);
}