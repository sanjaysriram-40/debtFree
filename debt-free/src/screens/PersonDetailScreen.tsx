import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import { Transaction, TransactionHistory } from '../types/types';
import { TransactionListItem } from '../components/TransactionListItem';
import { TransactionHistoryModal } from '../components/TransactionHistoryModal';
import { calculatePersonBalance } from '../utils/balanceCalculator';
import { getTransactionsByPerson, getTransactionHistory } from '../database/transactionRepository';
import { formatCurrency } from '../utils/formatters';
import FirebaseService from '../services/FirebaseService';

type PersonDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'PersonDetail'
>;

type PersonDetailScreenRouteProp = RouteProp<RootStackParamList, 'PersonDetail'>;

interface PersonDetailScreenProps {
    navigation: PersonDetailScreenNavigationProp;
    route: PersonDetailScreenRouteProp;
}

const PersonDetailScreen: React.FC<PersonDetailScreenProps> = ({
    navigation,
    route,
}) => {
    const { person } = route.params;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<TransactionHistory[]>([]);

    const loadTransactions = useCallback(async () => {
        try {
            const txns = await getTransactionsByPerson(person.id);
            setTransactions(txns);
        } catch (error) {
            console.error('Error loading transactions:', error);
            Alert.alert('Error', 'Failed to load transactions');
        }
    }, [person.id]);

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [loadTransactions]),
    );

    const balance = calculatePersonBalance(person, transactions);

    const getStatusColor = () => {
        if (balance.settled) return theme.colors.settled;
        if (balance.iOwe) return theme.colors.debt;
        return theme.colors.receive;
    };

    const handleAddTransaction = () => {
        navigation.navigate('AddTransaction', { person });
    };

    const handleEditTransaction = (transaction: Transaction) => {
        navigation.navigate('AddTransaction', { person, transaction });
    };

    const handleViewHistory = async (transaction: Transaction) => {
        try {
            const history = await getTransactionHistory(transaction.id);
            if (history.length === 0) {
                Alert.alert('Info', 'No edit history for this transaction');
                return;
            }
            setSelectedHistory(history);
            setHistoryModalVisible(true);
        } catch (error) {
            console.error('Error loading history:', error);
            Alert.alert('Error', 'Failed to load history');
        }
    };

    const handleDeleteTransaction = (transaction: Transaction) => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await FirebaseService.deleteTransaction(transaction.id);
                            loadTransactions();
                        } catch (error) {
                            console.error('Error deleting transaction:', error);
                            Alert.alert('Error', 'Failed to delete transaction');
                        }
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <View style={styles.content}>
                {/* Header Card */}
                <View style={styles.headerCard}>
                    <View style={[styles.avatar, { borderColor: getStatusColor() }]}>
                        <Text style={styles.avatarText}>
                            {person.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.name}>{person.name}</Text>
                    {person.phone && <Text style={styles.phone}>{person.phone}</Text>}

                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
                        <Text style={[styles.balanceAmount, { color: getStatusColor() }]}>
                            {formatCurrency(Math.abs(balance.netBalance))}
                        </Text>
                        <Text style={styles.balanceStatus}>
                            {balance.settled ? 'SETTLED' : balance.iOwe ? 'YOU OWE' : 'YOU LENT'}
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddTransaction}>
                        <Icon name="add" size={20} color="#000000" />
                        <Text style={styles.addButtonText}>NEW TRANSACTION</Text>
                    </TouchableOpacity>
                </View>

                {/* Transactions List Section */}
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>TRANSACTIONS</Text>
                    <View style={styles.listLine} />
                </View>

                <FlatList
                    data={transactions}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TransactionListItem
                            transaction={item}
                            onEdit={() => handleEditTransaction(item)}
                            onHistory={() => handleViewHistory(item)}
                            onDelete={() => handleDeleteTransaction(item)}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No transactions yet</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <TransactionHistoryModal
                visible={historyModalVisible}
                onClose={() => setHistoryModalVisible(false)}
                history={selectedHistory}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
    },
    headerCard: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.xl,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
        borderWidth: 2,
    },
    avatarText: {
        color: theme.colors.text,
        fontSize: theme.fontSize.xxl,
        fontWeight: 'bold',
    },
    name: {
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    phone: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
    },
    balanceContainer: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        width: '100%',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    balanceLabel: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: theme.fontSize.xxl,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    balanceStatus: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    actionContainer: {
        padding: theme.spacing.lg,
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        gap: theme.spacing.sm,
    },
    addButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: theme.fontSize.sm,
        letterSpacing: 1,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    listTitle: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginRight: 12,
    },
    listLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 40,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
    },
});

export default PersonDetailScreen;
