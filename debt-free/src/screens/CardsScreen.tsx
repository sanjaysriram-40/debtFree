import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Alert,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import { Card } from '../types/types';
import { getAllCards, deleteCard, createCard } from '../database/cardRepository';
import { CardStack } from '../components/CardStack';
import { AddCardModal } from '../components/AddCardModal';

import { useNavigation } from '@react-navigation/native';

export const CardsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [cards, setCards] = useState<Card[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    const loadCards = async () => {
        try {
            const allCards = await getAllCards();
            setCards(allCards);
            if (allCards.length > 0 && !selectedCard) {
                setSelectedCard(allCards[0]);
            }
        } catch (error) {
            console.error('Error loading cards:', error);
        }
    };

    const seedCards = async () => {
        const existing = await getAllCards();
        if (existing.length < 3) {
            await createCard(
                'HDFC Millennia',
                '4567 8901 2345 6789',
                'VISA',
                'Sanjay Kumar',
                '12/28',
                '123',
                '#1a237e'
            );
            await createCard(
                'ICICI Amazon Pay',
                '4321 8765 4321 0987',
                'VISA',
                'Sanjay Kumar',
                '05/29',
                '456',
                '#e65100'
            );
            await createCard(
                'SBI Prime',
                '5432 1098 7654 3210',
                'MASTERCARD',
                'Sanjay Kumar',
                '08/30',
                '789',
                '#2e7d32'
            );
            await createCard(
                'Axis Magnus',
                '6789 0123 4567 8901',
                'VISA',
                'Sanjay Kumar',
                '11/31',
                '321',
                '#880e4f'
            );
            await createCard(
                'PNB RuPay Platinum',
                '6071 2345 6789 0123',
                'RUPAY',
                'Sanjay Kumar',
                '09/32',
                '555',
                '#311b92'
            );
            loadCards();
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCards();
            seedCards();
        }, [])
    );

    const handleDeleteCard = (card: Card) => {
        Alert.alert(
            'Delete Card',
            `Are you sure you want to delete ${card.cardName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteCard(card.id);
                        const allCards = await getAllCards();
                        setCards(allCards);
                        if (allCards.length > 0) {
                            setSelectedCard(allCards[0]);
                        } else {
                            setSelectedCard(null);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MY CARDS ({cards.length})</Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(true)} style={styles.addButton}>
                    <Icon name="add" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.stackContainer}>
                    {cards.length > 0 ? (
                        <CardStack
                            cards={cards}
                            onTopCardChange={(card) => setSelectedCard(card)}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Icon name="credit-card" size={64} color={theme.colors.border} />
                            <Text style={styles.emptyText}>No cards added yet</Text>
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => setIsAddModalVisible(true)}
                            >
                                <Text style={styles.emptyButtonText}>ADD YOUR FIRST CARD</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {selectedCard && (
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Card Name</Text>
                            <Text style={styles.detailValue}>{selectedCard.cardName}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Card Number</Text>
                            <Text style={styles.detailValue}>{selectedCard.cardNumber}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Card Type</Text>
                            <Text style={styles.detailValue}>{selectedCard.cardType}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Name on Card</Text>
                            <Text style={styles.detailValue}>{selectedCard.nameOnCard}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Expiry Date</Text>
                            <Text style={styles.detailValue}>{selectedCard.expiry}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>CVV</Text>
                            <Text style={styles.detailValue}>{selectedCard.cvv}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteCard(selectedCard)}
                        >
                            <Icon name="delete-outline" size={20} color={theme.colors.error} />
                            <Text style={styles.deleteButtonText}>REMOVE CARD</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>

            <AddCardModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSave={() => {
                    setIsAddModalVisible(false);
                    loadCards();
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    addButton: {
        padding: 16,
        marginRight: -8,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 40,
    },
    stackContainer: {
        height: 480,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    emptyButton: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    emptyButtonText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    detailsContainer: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 16,
        padding: 24,
        marginTop: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        paddingBottom: 8,
    },
    detailLabel: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailValue: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        padding: 12,
    },
    deleteButtonText: {
        color: theme.colors.error,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 1,
    },
});
