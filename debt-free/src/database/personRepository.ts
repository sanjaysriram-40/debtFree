import { getDatabase } from './database';
import { Person } from '../types/types';

export const createPerson = async (
    name: string,
    phone?: string,
    notes?: string,
): Promise<number> => {
    const db = getDatabase();
    const created_at = Date.now();

    const result = await db.executeSql(
        'INSERT INTO Person (name, phone, notes, created_at) VALUES (?, ?, ?, ?)',
        [name, phone || null, notes || null, created_at],
    );

    return result[0].insertId;
};

export const getPersonById = async (id: number): Promise<Person | null> => {
    const db = getDatabase();

    const results = await db.executeSql('SELECT * FROM Person WHERE id = ?', [
        id,
    ]);

    if (results[0].rows.length === 0) {
        return null;
    }

    return results[0].rows.item(0) as Person;
};

export const getAllPersons = async (): Promise<Person[]> => {
    const db = getDatabase();

    const results = await db.executeSql(
        'SELECT * FROM Person ORDER BY created_at DESC',
    );

    const persons: Person[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
        persons.push(results[0].rows.item(i) as Person);
    }

    return persons;
};

export const updatePerson = async (
    id: number,
    data: { name?: string; phone?: string; notes?: string },
): Promise<void> => {
    const db = getDatabase();

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
        updates.push('name = ?');
        values.push(data.name);
    }
    if (data.phone !== undefined) {
        updates.push('phone = ?');
        values.push(data.phone || null);
    }
    if (data.notes !== undefined) {
        updates.push('notes = ?');
        values.push(data.notes || null);
    }

    if (updates.length === 0) {
        return;
    }

    values.push(id);

    await db.executeSql(
        `UPDATE Person SET ${updates.join(', ')} WHERE id = ?`,
        values,
    );
};

export const deletePerson = async (id: number): Promise<void> => {
    const db = getDatabase();
    await db.executeSql('DELETE FROM Person WHERE id = ?', [id]);
};
