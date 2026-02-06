import firestore from '@react-native-firebase/firestore';
import { Card, Person, Transaction } from '../types/types';
import * as cardRepo from '../database/cardRepository';
import * as personRepo from '../database/personRepository';
import * as transactionRepo from '../database/transactionRepository';

class FirebaseService {
    private userId: string | null = null;

    setUserId(userId: string) {
        this.userId = userId;
    }

    clearUserId() {
        this.userId = null;
    }

    private getUserCollection(collection: string) {
        if (!this.userId) throw new Error('User not authenticated');
        return firestore().collection('users').doc(this.userId).collection(collection);
    }

    private isFirestoreError(error: any): boolean {
        return error?.code === 'firestore/not-found' ||
            error?.message?.includes('database (default) does not exist');
    }

    // ==================== CARDS ====================

    async syncCards() {
        try {
            const localCards = await cardRepo.getAllCards();
            const batch = firestore().batch();

            localCards.forEach(card => {
                const docRef = this.getUserCollection('cards').doc(card.id.toString());
                batch.set(docRef, {
                    cardName: card.cardName,
                    cardNumber: card.cardNumber,
                    cardType: card.cardType,
                    nameOnCard: card.nameOnCard,
                    expiry: card.expiry,
                    cvv: card.cvv,
                    color: card.color,
                    created_at: card.created_at,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            });

            await batch.commit();
            console.log(`Synced ${localCards.length} cards to Firestore`);
        } catch (error) {
            if (this.isFirestoreError(error)) {
                console.warn('Firestore database not configured. Skipping cloud sync.');
                return;
            }
            console.error('Error syncing cards:', error);
            // Don't throw - allow app to continue with local storage
        }
    }

    async addCard(
        cardName: string,
        cardNumber: string,
        cardType: 'VISA' | 'MASTERCARD' | 'RUPAY',
        nameOnCard: string,
        expiry: string,
        cvv: string,
        color: string
    ) {
        try {
            const cardId = await cardRepo.createCard(cardName, cardNumber, cardType, nameOnCard, expiry, cvv, color);
            try {
                await this.getUserCollection('cards').doc(cardId.toString()).set({
                    cardName,
                    cardNumber,
                    cardType,
                    nameOnCard,
                    expiry,
                    cvv,
                    color,
                    created_at: Date.now(),
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Card saved locally only.');
                } else {
                    throw firestoreError;
                }
            }
            return cardId;
        } catch (error) {
            console.error('Error adding card:', error);
            throw error;
        }
    }

    async updateCard(
        id: number,
        cardName: string,
        cardNumber: string,
        cardType: 'VISA' | 'MASTERCARD' | 'RUPAY',
        nameOnCard: string,
        expiry: string,
        cvv: string,
        color: string
    ) {
        try {
            await cardRepo.updateCard(id, cardName, cardNumber, cardType, nameOnCard, expiry, cvv, color);
            try {
                await this.getUserCollection('cards').doc(id.toString()).update({
                    cardName,
                    cardNumber,
                    cardType,
                    nameOnCard,
                    expiry,
                    cvv,
                    color,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Card updated locally only.');
                } else {
                    throw firestoreError;
                }
            }
        } catch (error) {
            console.error('Error updating card:', error);
            throw error;
        }
    }

    async deleteCard(id: number) {
        try {
            await cardRepo.deleteCard(id);
            try {
                await this.getUserCollection('cards').doc(id.toString()).delete();
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Card deleted locally only.');
                } else {
                    throw firestoreError;
                }
            }
        } catch (error) {
            console.error('Error deleting card:', error);
            throw error;
        }
    }

    // ==================== PEOPLE ====================

    async syncPeople() {
        try {
            const localPeople = await personRepo.getAllPersons();
            const batch = firestore().batch();

            localPeople.forEach((person: Person) => {
                const docRef = this.getUserCollection('people').doc(person.id.toString());
                batch.set(docRef, {
                    name: person.name,
                    phone: person.phone || '',
                    notes: person.notes || '',
                    created_at: person.created_at,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            });

            await batch.commit();
            console.log(`Synced ${localPeople.length} people to Firestore`);
        } catch (error) {
            if (this.isFirestoreError(error)) {
                console.warn('Firestore database not configured. Skipping cloud sync.');
                return;
            }
            console.error('Error syncing people:', error);
            // Don't throw - allow app to continue with local storage
        }
    }

    async addPerson(name: string, phone?: string, notes?: string) {
        try {
            const personId = await personRepo.createPerson(name, phone, notes);
            try {
                await this.getUserCollection('people').doc(personId.toString()).set({
                    name,
                    phone: phone || '',
                    notes: notes || '',
                    created_at: Date.now(),
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Person saved locally only.');
                } else {
                    throw firestoreError;
                }
            }
            return personId;
        } catch (error) {
            console.error('Error adding person:', error);
            throw error;
        }
    }

    async updatePerson(id: number, name: string, phone?: string, notes?: string) {
        try {
            await personRepo.updatePerson(id, { name, phone, notes });
            try {
                await this.getUserCollection('people').doc(id.toString()).update({
                    name,
                    phone: phone || '',
                    notes: notes || '',
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Person updated locally only.');
                } else {
                    throw firestoreError;
                }
            }
        } catch (error) {
            console.error('Error updating person:', error);
            throw error;
        }
    }

    async deletePerson(id: number) {
        try {
            await personRepo.deletePerson(id);
            try {
                await this.getUserCollection('people').doc(id.toString()).delete();
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Person deleted locally only.');
                } else {
                    throw firestoreError;
                }
            }
        } catch (error) {
            console.error('Error deleting person:', error);
            throw error;
        }
    }

    // ==================== TRANSACTIONS ====================

    async syncTransactions() {
        try {
            const localTransactions = await transactionRepo.getAllTransactions();
            const batch = firestore().batch();

            localTransactions.forEach(transaction => {
                const docRef = this.getUserCollection('transactions').doc(transaction.id.toString());
                batch.set(docRef, {
                    person_id: transaction.person_id,
                    amount: transaction.amount,
                    direction: transaction.direction,
                    date: transaction.date,
                    note: transaction.note || '',
                    created_at: transaction.created_at,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            });

            await batch.commit();
            console.log(`Synced ${localTransactions.length} transactions to Firestore`);
        } catch (error) {
            if (this.isFirestoreError(error)) {
                console.warn('Firestore database not configured. Skipping cloud sync.');
                return;
            }
            console.error('Error syncing transactions:', error);
            // Don't throw - allow app to continue with local storage
        }
    }

    async addTransaction(
        personId: number,
        amount: number,
        direction: 'YOU_GAVE' | 'YOU_GOT',
        date: number,
        note?: string
    ) {
        try {
            const transactionId = await transactionRepo.createTransaction(personId, amount, direction, date, note);
            try {
                await this.getUserCollection('transactions').doc(transactionId.toString()).set({
                    person_id: personId,
                    amount,
                    direction,
                    date,
                    note: note || '',
                    created_at: Date.now(),
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Transaction saved locally only.');
                } else {
                    throw firestoreError;
                }
            }
            return transactionId;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    }

    async updateTransaction(
        id: number,
        amount: number,
        direction: 'YOU_GAVE' | 'YOU_GOT',
        date: number,
        note?: string
    ) {
        try {
            await transactionRepo.updateTransaction(id, amount, direction, date, note);
            try {
                await this.getUserCollection('transactions').doc(id.toString()).update({
                    amount,
                    direction,
                    date,
                    note: note || '',
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Transaction updated locally only.');
                } else {
                    throw firestoreError;
                }
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }

    async deleteTransaction(id: number) {
        try {
            await transactionRepo.deleteTransaction(id);
            try {
                await this.getUserCollection('transactions').doc(id.toString()).delete();
            } catch (firestoreError) {
                if (this.isFirestoreError(firestoreError)) {
                    console.warn('Firestore not available. Transaction deleted locally only.');
                } else {
                    throw firestoreError;
                }
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }

    // ==================== INITIAL SYNC ====================

    async performInitialSync() {
        try {
            console.log('Starting initial sync...');
            await this.syncCards();
            await this.syncPeople();
            await this.syncTransactions();
            console.log('Initial sync completed successfully');
        } catch (error) {
            if (this.isFirestoreError(error)) {
                console.warn('Firestore database not configured. App will work with local storage only.');
                return;
            }
            console.error('Error during initial sync:', error);
            // Don't throw - allow app to continue with local storage
        }
    }

    // ==================== DOWNLOAD FROM CLOUD ====================

    async downloadAllData() {
        try {
            console.log('Downloading data from cloud...');

            const cardsSnapshot = await this.getUserCollection('cards').get();
            const peopleSnapshot = await this.getUserCollection('people').get();
            const transactionsSnapshot = await this.getUserCollection('transactions').get();

            console.log(`Downloaded ${cardsSnapshot.size} cards, ${peopleSnapshot.size} people, ${transactionsSnapshot.size} transactions`);

            // Merge cloud data with local SQLite
            // Cards
            for (const doc of cardsSnapshot.docs) {
                const cloudCard = doc.data();
                const cardId = parseInt(doc.id);

                try {
                    // Try to get local card
                    const localCards = await cardRepo.getAllCards();
                    const localCard = localCards.find(c => c.id === cardId);

                    if (!localCard) {
                        // Card doesn't exist locally, insert it
                        await cardRepo.createCard(
                            cloudCard.cardName,
                            cloudCard.cardNumber,
                            cloudCard.cardType,
                            cloudCard.nameOnCard,
                            cloudCard.expiry,
                            cloudCard.cvv,
                            cloudCard.color
                        );
                    }
                } catch (error) {
                    console.error(`Error merging card ${cardId}:`, error);
                }
            }

            // People
            for (const doc of peopleSnapshot.docs) {
                const cloudPerson = doc.data();
                const personId = parseInt(doc.id);

                try {
                    const localPeople = await personRepo.getAllPersons();
                    const localPerson = localPeople.find((p: any) => p.id === personId);

                    if (!localPerson) {
                        await personRepo.createPerson(
                            cloudPerson.name,
                            cloudPerson.phone,
                            cloudPerson.notes
                        );
                    }
                } catch (error) {
                    console.error(`Error merging person ${personId}:`, error);
                }
            }

            // Transactions
            for (const doc of transactionsSnapshot.docs) {
                const cloudTransaction = doc.data();
                const transactionId = parseInt(doc.id);

                try {
                    const localTransactions = await transactionRepo.getAllTransactions();
                    const localTransaction = localTransactions.find(t => t.id === transactionId);

                    if (!localTransaction) {
                        await transactionRepo.createTransaction(
                            cloudTransaction.person_id,
                            cloudTransaction.amount,
                            cloudTransaction.direction,
                            cloudTransaction.date,
                            cloudTransaction.note
                        );
                    }
                } catch (error) {
                    console.error(`Error merging transaction ${transactionId}:`, error);
                }
            }

            console.log('Data download and merge completed');
        } catch (error) {
            if (this.isFirestoreError(error)) {
                console.warn('Firestore database not configured. No cloud data to download.');
                return;
            }
            console.error('Error downloading data:', error);
            // Don't throw - allow app to continue with local storage
        }
    }

    // ==================== REAL-TIME LISTENERS ====================

    private unsubscribeCards?: () => void;
    private unsubscribePeople?: () => void;
    private unsubscribeTransactions?: () => void;

    setupRealtimeListeners() {
        if (!this.userId) {
            console.warn('Cannot setup listeners: user not authenticated');
            return;
        }

        console.log('Setting up real-time Firestore listeners...');

        try {
            // Listen to cards collection
            this.unsubscribeCards = this.getUserCollection('cards').onSnapshot(
                async (snapshot) => {
                    console.log(`Cards changed: ${snapshot.docChanges().length} changes`);

                    for (const change of snapshot.docChanges()) {
                        const cardData = change.doc.data();
                        const cardId = parseInt(change.doc.id);

                        if (change.type === 'added' || change.type === 'modified') {
                            try {
                                const localCards = await cardRepo.getAllCards();
                                const exists = localCards.find(c => c.id === cardId);

                                if (!exists) {
                                    // Card doesn't exist locally, create it
                                    await cardRepo.createCard(
                                        cardData.cardName,
                                        cardData.cardNumber,
                                        cardData.cardType,
                                        cardData.nameOnCard,
                                        cardData.expiry,
                                        cardData.cvv,
                                        cardData.color
                                    );
                                } else {
                                    // Update existing card
                                    await cardRepo.updateCard(
                                        cardId,
                                        cardData.cardName,
                                        cardData.cardNumber,
                                        cardData.cardType,
                                        cardData.nameOnCard,
                                        cardData.expiry,
                                        cardData.cvv,
                                        cardData.color
                                    );
                                }
                            } catch (error) {
                                console.error('Error syncing card from Firestore:', error);
                            }
                        } else if (change.type === 'removed') {
                            try {
                                await cardRepo.deleteCard(cardId);
                            } catch (error) {
                                console.error('Error deleting card from local:', error);
                            }
                        }
                    }
                },
                (error) => {
                    console.error('Cards listener error:', error);
                }
            );

            // Listen to people collection
            this.unsubscribePeople = this.getUserCollection('people').onSnapshot(
                async (snapshot) => {
                    console.log(`People changed: ${snapshot.docChanges().length} changes`);

                    for (const change of snapshot.docChanges()) {
                        const personData = change.doc.data();
                        const personId = parseInt(change.doc.id);

                        if (change.type === 'added' || change.type === 'modified') {
                            try {
                                const localPeople = await personRepo.getAllPersons();
                                const exists = localPeople.find((p: any) => p.id === personId);

                                if (!exists) {
                                    await personRepo.createPerson(
                                        personData.name,
                                        personData.phone,
                                        personData.notes
                                    );
                                } else {
                                    await personRepo.updatePerson(
                                        personId,
                                        {
                                            name: personData.name,
                                            phone: personData.phone,
                                            notes: personData.notes
                                        }
                                    );
                                }
                            } catch (error) {
                                console.error('Error syncing person from Firestore:', error);
                            }
                        } else if (change.type === 'removed') {
                            try {
                                await personRepo.deletePerson(personId);
                            } catch (error) {
                                console.error('Error deleting person from local:', error);
                            }
                        }
                    }
                },
                (error) => {
                    console.error('People listener error:', error);
                }
            );

            // Listen to transactions collection
            this.unsubscribeTransactions = this.getUserCollection('transactions').onSnapshot(
                async (snapshot) => {
                    console.log(`Transactions changed: ${snapshot.docChanges().length} changes`);

                    for (const change of snapshot.docChanges()) {
                        const txnData = change.doc.data();
                        const txnId = parseInt(change.doc.id);

                        if (change.type === 'added' || change.type === 'modified') {
                            try {
                                const localTxns = await transactionRepo.getAllTransactions();
                                const exists = localTxns.find(t => t.id === txnId);

                                if (!exists) {
                                    await transactionRepo.createTransaction(
                                        txnData.person_id,
                                        txnData.amount,
                                        txnData.direction,
                                        txnData.date,
                                        txnData.note
                                    );
                                }
                                // Note: We don't have an updateTransaction method in the repo
                                // Transactions are typically immutable (delete and recreate if needed)
                            } catch (error) {
                                console.error('Error syncing transaction from Firestore:', error);
                            }
                        } else if (change.type === 'removed') {
                            try {
                                await transactionRepo.deleteTransaction(txnId);
                            } catch (error) {
                                console.error('Error deleting transaction from local:', error);
                            }
                        }
                    }
                },
                (error) => {
                    console.error('Transactions listener error:', error);
                }
            );

            console.log('Real-time listeners setup complete');
        } catch (error) {
            if (this.isFirestoreError(error)) {
                console.warn('Firestore database not configured. Real-time sync disabled.');
                return;
            }
            console.error('Error setting up listeners:', error);
            // Don't throw - allow app to continue without real-time sync
        }
    }

    stopListeners() {
        console.log('Stopping Firestore listeners...');

        if (this.unsubscribeCards) {
            this.unsubscribeCards();
            this.unsubscribeCards = undefined;
        }

        if (this.unsubscribePeople) {
            this.unsubscribePeople();
            this.unsubscribePeople = undefined;
        }

        if (this.unsubscribeTransactions) {
            this.unsubscribeTransactions();
            this.unsubscribeTransactions = undefined;
        }

        console.log('Listeners stopped');
    }
}

export default new FirebaseService();
