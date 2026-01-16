import { getDatabase } from './database';
import { Transaction, TransactionDirection, TransactionHistory } from '../types/types';

export const createTransaction = async (
    personId: number,
    amount: number,
    direction: TransactionDirection,
    date: number,
    note?: string,
): Promise<number> => {
    const db = getDatabase();
    const created_at = Date.now();

    const result = await db.executeSql(
        'INSERT INTO TransactionTable (person_id, amount, direction, date, note, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [personId, amount, direction, date, note || null, created_at],
    );

    return result[0].insertId;
};

export const getTransactionsByPerson = async (
    personId: number,
): Promise<Transaction[]> => {
    const db = getDatabase();

    const results = await db.executeSql(
        'SELECT * FROM TransactionTable WHERE person_id = ? ORDER BY date DESC, created_at DESC',
        [personId],
    );

    const transactions: Transaction[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
        transactions.push(results[0].rows.item(i) as Transaction);
    }

    return transactions;
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
    const db = getDatabase();

    const results = await db.executeSql(
        'SELECT * FROM TransactionTable ORDER BY date DESC, created_at DESC',
    );

    const transactions: Transaction[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
        transactions.push(results[0].rows.item(i) as Transaction);
    }

    return transactions;
};

export const updateTransaction = async (
    id: number,
    amount: number,
    direction: TransactionDirection,
    date: number,
    note?: string,
): Promise<void> => {
    const db = getDatabase();

    // First, get the current transaction data to save to history
    const currentResults = await db.executeSql(
        'SELECT * FROM TransactionTable WHERE id = ?',
        [id],
    );

    if (currentResults[0].rows.length === 0) {
        throw new Error('Transaction not found');
    }

    const currentTransaction = currentResults[0].rows.item(0) as Transaction;

    // Insert current state into history
    const changed_at = Date.now();
    await db.executeSql(
        'INSERT INTO TransactionHistory (transaction_id, previous_amount, previous_direction, previous_date, previous_note, changed_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
            id,
            currentTransaction.amount,
            currentTransaction.direction,
            currentTransaction.date,
            currentTransaction.note || null,
            changed_at,
        ],
    );

    // Update the transaction
    await db.executeSql(
        'UPDATE TransactionTable SET amount = ?, direction = ?, date = ?, note = ? WHERE id = ?',
        [amount, direction, date, note || null, id],
    );
};

export const deleteTransaction = async (id: number): Promise<void> => {
    const db = getDatabase();
    await db.executeSql('DELETE FROM TransactionTable WHERE id = ?', [id]);
};

export const getTransactionHistory = async (
    transactionId: number,
): Promise<TransactionHistory[]> => {
    const db = getDatabase();

    const results = await db.executeSql(
        'SELECT * FROM TransactionHistory WHERE transaction_id = ? ORDER BY changed_at DESC',
        [transactionId],
    );

    const history: TransactionHistory[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
        history.push(results[0].rows.item(i) as TransactionHistory);
    }

    return history;
};

