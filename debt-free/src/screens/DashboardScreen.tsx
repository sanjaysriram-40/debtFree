import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import { Person, PersonBalance } from '../types/types';
import { getAllPersons } from '../database/personRepository';
import { getTransactionsByPerson } from '../database/transactionRepository';
import { calculatePersonBalance, calculateGlobalBalance } from '../utils/balanceCalculator';
import { PersonListItem } from '../components/PersonListItem';
import { AddPersonModal } from '../components/AddPersonModal';
import { formatCurrency } from '../utils/formatters';

type DashboardScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Dashboard'
>;

interface DashboardScreenProps {
    navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
    const [persons, setPersons] = useState<PersonBalance[]>([]);
    const [globalBalance, setGlobalBalance] = useState({
        globalNet: 0,
        totalLent: 0,
        totalBorrowed: 0,
        message: 'Loading...',
        color: 'gray',
    });
    const [isAddPersonModalVisible, setIsAddPersonModalVisible] = useState(false);

    const loadData = async () => {
        try {
            const allPersons = await getAllPersons();
            const balances: PersonBalance[] = [];

            for (const person of allPersons) {
                const transactions = await getTransactionsByPerson(person.id);
                const balance = calculatePersonBalance(person, transactions);
                balances.push(balance);
            }

            balances.sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance));
            setPersons(balances);

            const global = calculateGlobalBalance(balances);
            setGlobalBalance(global);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, []),
    );

    const handlePersonPress = (person: Person) => {
        navigation.navigate('PersonDetail', { person });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} translucent={false} />
            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Member</Text>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.cardsButton}
                        onPress={() => navigation.navigate('Cards')}>
                        <Icon name="credit-card" size={28} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Global Status Banner */}
                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.globalStatus,
                            { borderColor: globalBalance.globalNet >= 0 ? theme.colors.receive : theme.colors.debt },
                        ]}>
                        <Text style={styles.statusLabel}>NET BALANCE</Text>
                        <Text style={[
                            styles.globalStatusText,
                            { color: globalBalance.globalNet >= 0 ? theme.colors.receive : theme.colors.debt }
                        ]}>
                            {formatCurrency(Math.abs(globalBalance.globalNet))}
                        </Text>
                        <Text style={styles.statusMessage}>{globalBalance.message.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <View style={[styles.indicator, { backgroundColor: theme.colors.receive }]} />
                        <Text style={styles.summaryLabel}>YOU LENT</Text>
                        <Text style={styles.summaryAmount}>
                            {formatCurrency(globalBalance.totalLent)}
                        </Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <View style={[styles.indicator, { backgroundColor: theme.colors.debt }]} />
                        <Text style={styles.summaryLabel}>BORROWED</Text>
                        <Text style={styles.summaryAmount}>
                            {formatCurrency(globalBalance.totalBorrowed)}
                        </Text>
                    </View>
                </View>

                {/* People List Section */}
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>YOUR CIRCLE</Text>
                    <View style={styles.listLine} />
                </View>

                <FlatList
                    data={persons}
                    keyExtractor={item => item.person.id.toString()}
                    renderItem={({ item }) => (
                        <PersonListItem
                            personBalance={item}
                            onPress={() => handlePersonPress(item.person)}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Your circle is empty</Text>
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => setIsAddPersonModalVisible(true)}>
                                <Text style={styles.emptyButtonText}>ADD SOMEONE</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

                {/* FAB */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setIsAddPersonModalVisible(true)}>
                    <Icon name="add" size={32} color="#000000" />
                </TouchableOpacity>

                <AddPersonModal
                    visible={isAddPersonModalVisible}
                    onClose={() => setIsAddPersonModalVisible(false)}
                    onSave={loadData}
                />
            </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    cardsButton: {
        padding: 8,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderRadius: 12,
    },
    greeting: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: theme.fontSize.xxl,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statusContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    globalStatus: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    statusLabel: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 8,
    },
    globalStatusText: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: 'bold',
        letterSpacing: -1,
    },
    statusMessage: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 12,
        letterSpacing: 1,
    },
    summaryContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    indicator: {
        width: 20,
        height: 3,
        borderRadius: 2,
        marginBottom: 12,
    },
    summaryLabel: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 4,
    },
    summaryAmount: {
        color: theme.colors.text,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
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
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
    },
    emptyButton: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
    },
    emptyButtonText: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.xs,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
});

export default DashboardScreen;
