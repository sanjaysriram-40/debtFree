import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Alert,
    ScrollView,
    TextInput,
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
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [searchQuery, setSearchQuery] = useState('');


    const filteredCards = useMemo(() => {
        if (!searchQuery.trim()) return cards;
        const query = searchQuery.toLowerCase().trim();
        return cards.filter(card =>
            card.cardName.toLowerCase().includes(query) ||
            card.cardNumber.toLowerCase().includes(query) ||
            card.nameOnCard.toLowerCase().includes(query) ||
            card.cardType.toLowerCase().includes(query)
        );
    }, [cards, searchQuery]);

    // Initialize selectedCard when cards load or when search clears all results
    useEffect(() => {
        if (filteredCards.length > 0 && !selectedCard) {
            setSelectedCard(filteredCards[0]);
        } else if (filteredCards.length === 0) {
            setSelectedCard(null);
        }
    }, [filteredCards.length, selectedCard]);


    const loadCards = useCallback(async () => {
        try {
            const allCards = await getAllCards();
            setCards(allCards);
            if (allCards.length > 0 && !selectedCard) {
                setSelectedCard(allCards[0]);
            }
        } catch (error) {
            console.error('Error loading cards:', error);
        }
    }, [selectedCard]);

    const seedCards = useCallback(async () => {
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
    }, [loadCards]);

    useFocusEffect(
        useCallback(() => {
            loadCards();
            seedCards();
        }, [loadCards, seedCards])
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

    const handleEditCard = () => {
        if (selectedCard) {
            setIsEditModalVisible(true);
        }
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

            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Icon name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search cards..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="close" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.stackContainer}>
                    {filteredCards.length > 0 ? (
                        <CardStack
                            cards={filteredCards}
                            onTopCardChange={(card) => setSelectedCard(card)}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Icon name="credit-card" size={64} color={theme.colors.border} />
                            <Text style={styles.emptyText}>
                                {searchQuery ? 'No matching cards found' : 'No cards added yet'}
                            </Text>
                            {!searchQuery && (
                                <TouchableOpacity
                                    style={styles.emptyButton}
                                    onPress={() => setIsAddModalVisible(true)}
                                >
                                    <Text style={styles.emptyButtonText}>ADD YOUR FIRST CARD</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {selectedCard && (
                <View style={styles.footerActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditCard}
                    >
                        <Icon name="edit" size={20} color={theme.colors.primary} />
                        <Text style={styles.editButtonText}>EDIT CARD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCard(selectedCard)}
                    >
                        <Icon name="delete-outline" size={20} color={theme.colors.error} />
                        <Text style={styles.deleteButtonText}>REMOVE CARD</Text>
                    </TouchableOpacity>
                </View>
            )}

            <AddCardModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSave={() => {
                    setIsAddModalVisible(false);
                    loadCards();
                }}
            />

            <AddCardModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSave={() => {
                    setIsEditModalVisible(false);
                    loadCards();
                }}
                editCard={selectedCard}
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
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 16,
    },
    stackContainer: {
        height: 480,
        justifyContent: 'center',
        alignItems: 'center',
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
    footerActions: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: 12,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    editButtonText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 1,
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: 'rgba(255, 51, 102, 0.1)',
        borderRadius: 12,
    },
    deleteButtonText: {
        color: theme.colors.error,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 1,
    },
});
