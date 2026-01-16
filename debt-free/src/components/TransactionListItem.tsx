import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import { Transaction } from '../types/types';
import { formatRelativeDate, formatCurrency } from '../utils/formatters';

interface TransactionListItemProps {
    transaction: Transaction;
    onEdit: () => void;
    onHistory: () => void;
    onDelete: () => void;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({
    transaction,
    onEdit,
    onHistory,
    onDelete,
}) => {
    const isLent = transaction.direction === 'YOU_GAVE';
    const color = isLent ? theme.colors.receive : theme.colors.debt;

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <View style={[styles.indicator, { backgroundColor: color }]} />
                <View>
                    <Text style={styles.action}>
                        {isLent ? 'YOU LENT' : 'YOU BORROWED'}
                    </Text>
                    <Text style={[styles.amount, { color }]}>
                        {formatCurrency(transaction.amount)}
                    </Text>
                    {transaction.note && <Text style={styles.note}>{transaction.note}</Text>}
                    <Text style={styles.date}>{formatRelativeDate(transaction.date)}</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={onHistory} style={styles.iconButton}>
                    <Icon name="history" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
                    <Icon name="edit" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
                    <Icon name="delete" size={18} color={theme.colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    leftSection: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
    },
    indicator: {
        width: 3,
        height: 40,
        borderRadius: 2,
        marginRight: theme.spacing.md,
        marginTop: 4,
    },
    action: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        letterSpacing: 1,
        marginBottom: 2,
    },
    amount: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    note: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        opacity: 0.8,
        marginBottom: 4,
    },
    date: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        marginLeft: 4,
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
    },
});
