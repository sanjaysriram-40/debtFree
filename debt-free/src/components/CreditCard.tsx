import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { theme } from '../styles/theme';
import { Card, CardType } from '../types/types';

interface CreditCardProps {
    card: Card;
}

export const CreditCard: React.FC<CreditCardProps> = ({ card }) => {
    const renderCardTypeIcon = (type: CardType) => {
        switch (type) {
            case 'VISA':
                return <FontAwesome name="cc-visa" size={32} color="#FFFFFF" />;
            case 'MASTERCARD':
                return (
                    <View style={styles.networkContainer}>
                        <View style={[styles.networkCircle, { backgroundColor: '#EB001B' }]} />
                        <View style={[styles.networkCircle, { marginLeft: -15, backgroundColor: '#F79E1B', opacity: 0.8 }]} />
                    </View>
                );
            case 'RUPAY':
                return (
                    <View style={styles.rupayContainer}>
                        <Text style={styles.rupayText}>RuPay</Text>
                    </View>
                );
            default:
                return <Icon name="credit-card" size={32} color="rgba(255, 255, 255, 0.8)" />;
        }
    };

    return (
        <View style={[styles.card, { backgroundColor: card.color || theme.colors.cardBackground }]}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.bankLabel}>DEBTFREE BANK</Text>
                    <Text style={styles.cardName}>{card.cardName.toUpperCase()}</Text>
                </View>
                <Icon name="credit-card" size={32} color="rgba(255, 255, 255, 0.8)" />
            </View>

            <View style={styles.body}>
                <View style={styles.horizontalDetails}>
                    <View style={styles.numberContainer}>
                        <Text style={styles.cardNumberRow}>
                            {card.cardNumber ? card.cardNumber.split(' ').slice(0, 2).join(' ') : '**** ****'}
                        </Text>
                        <Text style={styles.cardNumberRow}>
                            {card.cardNumber ? card.cardNumber.split(' ').slice(2, 4).join(' ') : '**** ****'}
                        </Text>
                    </View>
                    <View style={styles.horizontalExpiryCvv}>
                        <View style={styles.horizontalDetailItem}>
                            <Text style={styles.horizontalLabel}>EXP</Text>
                            <Text style={styles.horizontalValue}>{card.expiry}</Text>
                        </View>
                        <View style={styles.horizontalDetailItem}>
                            <Text style={styles.horizontalLabel}>CVV</Text>
                            <Text style={styles.horizontalValue}>{card.cvv}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>CARD HOLDER</Text>
                        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
                            {card.nameOnCard.toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.networkContainer}>
                        {renderCardTypeIcon(card.cardType)}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 280,
        height: 440,
        borderRadius: 24,
        padding: 24,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardName: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginTop: 2,
    },
    bankLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    horizontalDetails: {
        alignItems: 'flex-start',
    },
    numberContainer: {
        marginBottom: 20,
    },
    cardNumberRow: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 4,
        marginBottom: 8,
    },
    horizontalExpiryCvv: {
        flexDirection: 'row',
        gap: 30,
    },
    horizontalDetailItem: {
        alignItems: 'flex-start',
    },
    horizontalLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 4,
    },
    horizontalValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footer: {
        marginTop: 'auto',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 20,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    value: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    networkContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
    },
    networkCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    rupayContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    rupayText: {
        color: '#1a237e',
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
});
