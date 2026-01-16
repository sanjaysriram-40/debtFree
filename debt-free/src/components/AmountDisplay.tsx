import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { formatCurrency } from '../utils/formatters';

interface AmountDisplayProps {
    amount: number;
    type: 'owe' | 'receive' | 'settled';
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount, type }) => {
    const getColor = () => {
        switch (type) {
            case 'owe':
                return theme.colors.debt;
            case 'receive':
                return theme.colors.receive;
            case 'settled':
                return theme.colors.settled;
        }
    };

    return (
        <Text style={[styles.amount, { color: getColor() }]}>
            {formatCurrency(amount)}
        </Text>
    );
};

const styles = StyleSheet.create({
    amount: {
        fontSize: theme.fontSize.lg,
        fontWeight: '600',
    },
});
