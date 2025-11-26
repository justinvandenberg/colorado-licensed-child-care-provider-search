import * as SQLite from "expo-sqlite";

export const localDb = SQLite.openDatabaseSync("local.db");
