import knex, { Knex } from "knex";
import path from "path";
import { config } from "../config";

let dbInstance: Knex;

export function getDatabase(): Knex {
  if (!dbInstance) {
    if (config.database.client === "pg") {
      dbInstance = knex({
        client: "pg",
        connection: config.database.connectionString || {
          host: "127.0.0.1",
          user: "postgres",
          password: "",
          database: "radhix_erp",
        },
        pool: { min: 2, max: 10 },
      });
    } else {
      const dbPath = path.isAbsolute(config.database.filename)
        ? config.database.filename
        : path.join(__dirname, "..", "..", config.database.filename);

      dbInstance = knex({
        client: "sqlite3",
        connection: {
          filename: dbPath,
        },
        useNullAsDefault: true,
        pool: {
          afterCreate: (conn: any, cb: any) => {
            conn.run("PRAGMA foreign_keys = ON", cb);
          },
        },
      });
    }
  }
  return dbInstance;
}

export const db = getDatabase();
