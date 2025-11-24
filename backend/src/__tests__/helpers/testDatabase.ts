import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

let db: Database.Database | null = null;

export const getTestDatabase = (): Database.Database => {
  if (!db) {
    db = new Database(':memory:');
    const schemaPath = path.join(__dirname, '../../db/schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf-8');

    schema = schema
      .replace(/SERIAL PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/VARCHAR\(\d+\)/g, 'TEXT')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/DECIMAL\(10,2\)/g, 'REAL')
      .replace(/DECIMAL/g, 'REAL');

    db.exec(schema);
  }
  return db;
};

export const closeTestDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};

export const clearTestDatabase = (): void => {
  const database = getTestDatabase();
  database.exec('DELETE FROM calculations');
  database.exec('DELETE FROM users');
};

export const createTestPool = () => {
  const database = getTestDatabase();

  return {
    query: async (text: string, params?: any[]) => {
      try {
        let sqliteQuery = text;
        let sqliteParams = params || [];

        // PostgreSQL allows $2 to be used multiple times, but SQLite doesn't
        // We need to duplicate the parameter value for each occurrence
        const placeholderMatches = text.match(/\$\d+/g) || [];

        if (placeholderMatches.length > 0 && params && params.length > 0) {
          // Build new params array by duplicating values as needed
          const newParams: any[] = [];

          // Replace each $N with ? and add the corresponding param value
          sqliteQuery = text.replace(/\$(\d+)/g, (match, num) => {
            const paramIndex = parseInt(num) - 1; // Convert to 0-indexed
            newParams.push(params[paramIndex]);
            return '?';
          });

          sqliteParams = newParams;
        } else {
          sqliteQuery = text.replace(/\$\d+/g, '?');
        }

        // Handle SELECT queries
        if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
          const stmt = database.prepare(sqliteQuery);
          const rows = sqliteParams.length > 0 ? stmt.all(...sqliteParams) : stmt.all();
          return { rows, rowCount: rows.length };
        }

        // Handle INSERT/UPDATE/DELETE queries
        const stmt = database.prepare(sqliteQuery);
        const info = sqliteParams.length > 0 ? stmt.run(...sqliteParams) : stmt.run();

        // For INSERT with RETURNING, fetch the inserted row
        if (text.toUpperCase().includes('RETURNING')) {
          const lastId = info.lastInsertRowid;
          const tableName = text.match(/INSERT INTO (\w+)/i)?.[1];
          if (tableName && lastId) {
            const selectStmt = database.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
            const rows = selectStmt.all(lastId);
            return { rows, rowCount: rows.length };
          }
        }

        return { rows: [], rowCount: info.changes };
      } catch (error) {
        console.error('Query error:', error);
        console.error('Original query:', text);
        console.error('Params:', params);
        throw error;
      }
    },
  };
};
