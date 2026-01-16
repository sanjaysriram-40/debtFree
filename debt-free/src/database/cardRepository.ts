import { getDatabase } from './database';
import { Card, CardType } from '../types/types';

export const getAllCards = async (): Promise<Card[]> => {
    const db = getDatabase();
    const [results] = await db.executeSql('SELECT * FROM Cards ORDER BY created_at DESC');
    const cards: Card[] = [];
    for (let i = 0; i < results.rows.length; i++) {
        cards.push(results.rows.item(i));
    }
    return cards;
};

export const createCard = async (
    cardName: string,
    cardNumber: string,
    cardType: CardType,
    nameOnCard: string,
    expiry: string,
    cvv: string,
    color: string,
): Promise<number> => {
    const db = getDatabase();
    const [results] = await db.executeSql(
        'INSERT INTO Cards (cardName, cardNumber, cardType, nameOnCard, expiry, cvv, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [cardName, cardNumber, cardType, nameOnCard, expiry, cvv, color, Date.now()],
    );
    return results.insertId;
};

export const deleteCard = async (id: number): Promise<void> => {
    const db = getDatabase();
    await db.executeSql('DELETE FROM Cards WHERE id = ?', [id]);
};
