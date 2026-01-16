import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import { TransactionHistory } from '../types/types';
import { formatCurrency } from '../utils/formatters';

interface TransactionHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    history: TransactionHistory[];
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
    visible,
    onClose,
    history,
}) => {
    // Group history by day
    const groupedHistory = history.reduce((groups: { [key: string]: TransactionHistory[] }, item) => {
        const date = new Date(item.changed_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {});

    const renderHistoryItem = (item: TransactionHistory, isLast: boolean) => {
        const isLent = item.previous_direction === 'YOU_GAVE';
        const color = isLent ? theme.colors.receive : theme.colors.debt;

        return (
            <View key={item.id} style={styles.historyItemContainer}>
                <View style={styles.threadSection}>
                    <View style={[styles.threadDot, { backgroundColor: color }]} />
                    {!isLast && <View style={styles.threadLine} />}
                </View>
                <View style={styles.historyCard}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyAction}>
                            {isLent ? 'PREVIOUSLY LENT' : 'PREVIOUSLY BORROWED'}
                        </Text>
                        <Text style={styles.historyTime}>
                            {new Date(item.changed_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                    <Text style={[styles.historyAmount, { color }]}>
                        {formatCurrency(item.previous_amount)}
                    </Text>
                    {item.previous_note && <Text style={styles.historyNote}>{item.previous_note}</Text>}
                </View>
            </View>
        );
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
                        <Text style={styles.title}>EDIT HISTORY</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}>
                        {Object.entries(groupedHistory).map(([date, items]) => (
                            <View key={date} style={styles.dateGroup}>
                                <View style={styles.dateHeader}>
                                    <Text style={styles.dateText}>{date.toUpperCase()}</Text>
                                    <View style={styles.dateLine} />
                                </View>
                                {items.map((item, index) =>
                                    renderHistoryItem(item, index === items.length - 1),
                                )}
                            </View>
                        ))}
                        {history.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No history available</Text>
                            </View>
                        )}
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
        height: '80%',
        borderWidth: 1,
        borderColor: theme.colors.border,
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
        flex: 1,
    },
    scrollContent: {
        padding: theme.spacing.xl,
    },
    dateGroup: {
        marginBottom: theme.spacing.xl,
    },
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    dateText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        letterSpacing: 1,
        marginRight: 12,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    historyItemContainer: {
        flexDirection: 'row',
    },
    threadSection: {
        alignItems: 'center',
        marginRight: theme.spacing.lg,
        width: 20,
    },
    threadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 6,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    threadLine: {
        flex: 1,
        width: 2,
        backgroundColor: theme.colors.border,
        marginVertical: 4,
    },
    historyCard: {
        flex: 1,
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    historyAction: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        letterSpacing: 1,
    },
    historyTime: {
        fontSize: 10,
        color: theme.colors.textSecondary,
    },
    historyAmount: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    historyNote: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        opacity: 0.8,
    },
    emptyState: {
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
    },
});
