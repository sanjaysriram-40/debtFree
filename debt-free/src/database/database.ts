import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const DATABASE_NAME = 'debtfree.db';

let database: SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLiteDatabase> => {
  if (database) {
    return database;
  }

  try {
    database = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });

    console.log('Database opened successfully');

    // Create tables
    await createTables(database);

    return database;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

const createTables = async (db: SQLiteDatabase): Promise<void> => {
  // Create Person table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS Person (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  // Create Transaction table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS TransactionTable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      person_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      direction TEXT NOT NULL CHECK(direction IN ('YOU_GAVE', 'YOU_GOT')),
      date INTEGER NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (person_id) REFERENCES Person(id) ON DELETE CASCADE
    );
  `);

  // Create TransactionHistory table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS TransactionHistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER NOT NULL,
      previous_amount REAL NOT NULL,
      previous_direction TEXT NOT NULL,
      previous_date INTEGER NOT NULL,
      previous_note TEXT,
      changed_at INTEGER NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES TransactionTable(id) ON DELETE CASCADE
    );
  `);

  // Create Cards table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS Cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cardName TEXT NOT NULL,
      cardNumber TEXT NOT NULL,
      cardType TEXT NOT NULL CHECK(cardType IN ('VISA', 'MASTERCARD', 'RUPAY')),
      nameOnCard TEXT NOT NULL,
      expiry TEXT NOT NULL,
      cvv TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  // Create index for faster queries
  await db.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_transaction_person 
    ON TransactionTable(person_id);
  `);

  console.log('Database tables created successfully');
};

export const getDatabase = (): SQLiteDatabase => {
  if (!database) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return database;
};

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.close();
    database = null;
    console.log('Database closed');
  }
};
