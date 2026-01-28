import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import { Card, CardType } from '../types/types';
import { createCard, updateCard } from '../database/cardRepository';

interface AddCardModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    editCard?: Card | null;
}

const CARD_TYPES: CardType[] = ['VISA', 'MASTERCARD', 'RUPAY'];
const CARD_COLORS = [
    '#1A1A1A', // Black
    '#2C3E50', // Midnight Blue
    '#8E44AD', // Amethyst
    '#27AE60', // Nephritis
    '#D35400', // Pumpkin
    '#C0392B', // Pomegranate
];

export const AddCardModal: React.FC<AddCardModalProps> = ({
    visible,
    onClose,
    onSave,
    editCard = null,
}) => {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState<CardType>('VISA');
    const [nameOnCard, setNameOnCard] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [color, setColor] = useState(CARD_COLORS[0]);
    const [error, setError] = useState<string | null>(null);

    // Pre-fill form when editing
    React.useEffect(() => {
        if (editCard) {
            setCardName(editCard.cardName);
            setCardNumber(editCard.cardNumber);
            setCardType(editCard.cardType);
            setNameOnCard(editCard.nameOnCard);
            setExpiry(editCard.expiry);
            setCvv(editCard.cvv);
            setColor(editCard.color);
        } else {
            resetForm();
        }
    }, [editCard, visible]);

    const handleCardNumberChange = (text: string) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');
        // Add space every 4 digits
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
        setCardNumber(formatted);
    };

    const handleExpiryChange = (text: string) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');
        // Add slash after 2 digits
        let formatted = cleaned;
        if (cleaned.length > 2) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        setExpiry(formatted);
    };

    const handleSave = async () => {
        if (!cardName.trim() || !cardNumber.trim() || !nameOnCard.trim() || !expiry.trim() || !cvv.trim()) {
            setError('All fields are required');
            return;
        }

        try {
            if (editCard) {
                // Update existing card
                await updateCard(
                    editCard.id,
                    cardName.trim(),
                    cardNumber.trim(),
                    cardType,
                    nameOnCard.trim(),
                    expiry.trim(),
                    cvv.trim(),
                    color
                );
            } else {
                // Create new card
                await createCard(
                    cardName.trim(),
                    cardNumber.trim(),
                    cardType,
                    nameOnCard.trim(),
                    expiry.trim(),
                    cvv.trim(),
                    color
                );
            }
            resetForm();
            onSave();
        } catch (err) {
            console.error('Error saving card:', err);
            setError('Failed to save card');
        }
    };

    const resetForm = () => {
        setCardName('');
        setCardNumber('');
        setCardType('VISA');
        setNameOnCard('');
        setExpiry('');
        setCvv('');
        setColor(CARD_COLORS[0]);
        setError(null);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{editCard ? 'EDIT CARD' : 'ADD NEW CARD'}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CARD NAME (e.g. HDFC Bank)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter card name"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={cardName}
                                onChangeText={setCardName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CARD NUMBER</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="**** **** **** ****"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={cardNumber}
                                onChangeText={handleCardNumberChange}
                                keyboardType="numeric"
                                maxLength={19}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CARD TYPE</Text>
                            <View style={styles.typeContainer}>
                                {CARD_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.typeButton,
                                            cardType === type && styles.typeButtonActive,
                                        ]}
                                        onPress={() => setCardType(type)}>
                                        <Text style={[
                                            styles.typeButtonText,
                                            cardType === type && styles.typeButtonTextActive,
                                        ]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>NAME ON CARD</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter name as on card"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={nameOnCard}
                                onChangeText={setNameOnCard}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>EXPIRY (MM/YY)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="MM/YY"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={expiry}
                                    onChangeText={handleExpiryChange}
                                    maxLength={5}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>CVV</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="***"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={cvv}
                                    onChangeText={setCvv}
                                    maxLength={3}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CARD COLOR</Text>
                            <View style={styles.colorContainer}>
                                {CARD_COLORS.map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: c },
                                            color === c && styles.colorCircleActive,
                                        ]}
                                        onPress={() => setColor(c)}
                                    />
                                ))}
                            </View>
                        </View>

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>{editCard ? 'UPDATE CARD' : 'SAVE CARD'}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 2,
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: theme.spacing.xl,
    },
    inputGroup: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        letterSpacing: 1,
        marginBottom: theme.spacing.sm,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    row: {
        flexDirection: 'row',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    typeButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    typeButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
    },
    typeButtonText: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    typeButtonTextActive: {
        color: theme.colors.primary,
    },
    colorContainer: {
        flexDirection: 'row',
        gap: 15,
        flexWrap: 'wrap',
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorCircleActive: {
        borderColor: theme.colors.text,
    },
    errorText: {
        color: theme.colors.error,
        marginBottom: theme.spacing.md,
        fontSize: theme.fontSize.sm,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    saveButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
        letterSpacing: 1,
    },
});
