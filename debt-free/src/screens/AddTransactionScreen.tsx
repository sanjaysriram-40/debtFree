import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import { TransactionDirection } from '../types/types';
import FirebaseService from '../services/FirebaseService';

type AddTransactionScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AddTransaction'
>;

type AddTransactionScreenRouteProp = RouteProp<
    RootStackParamList,
    'AddTransaction'
>;

interface AddTransactionScreenProps {
    navigation: AddTransactionScreenNavigationProp;
    route: AddTransactionScreenRouteProp;
}

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({
    navigation,
    route,
}) => {
    const { person, transaction } = route.params;
    const isEditing = !!transaction;

    const [amount, setAmount] = useState(transaction ? transaction.amount.toString() : '');
    const [direction, setDirection] = useState<TransactionDirection>(
        transaction ? transaction.direction : 'YOU_GAVE'
    );
    const [note, setNote] = useState(transaction ? transaction.note || '' : '');
    const [date] = useState(transaction ? transaction.date : Date.now());

    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Transaction' : 'Add Transaction',
        });
    }, [navigation, isEditing]);

    const handleSave = async () => {
        if (!person) {
            Alert.alert('Error', 'No person selected');
            return;
        }

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        try {
            if (isEditing && transaction) {
                await FirebaseService.updateTransaction(
                    transaction.id,
                    amountNum,
                    direction,
                    date,
                    note.trim() || undefined,
                );
                Alert.alert('Success', 'Transaction updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                await FirebaseService.addTransaction(
                    person.id,
                    amountNum,
                    direction,
                    date,
                    note.trim() || undefined,
                );
                Alert.alert('Success', 'Transaction added successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            Alert.alert('Error', 'Failed to save transaction');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                {/* Person Info */}
                <View style={styles.section}>
                    <Text style={styles.label}>Person</Text>
                    <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyText}>{person?.name}</Text>
                    </View>
                </View>

                {/* Amount Input */}
                <View style={styles.section}>
                    <Text style={styles.label}>Amount (₹)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                        placeholderTextColor={theme.colors.textSecondary}
                    />
                </View>

                {/* Direction Toggle */}
                <View style={styles.section}>
                    <Text style={styles.label}>Direction</Text>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                direction === 'YOU_GAVE' && styles.toggleButtonActiveGave,
                            ]}
                            onPress={() => setDirection('YOU_GAVE')}>
                            <Text
                                style={[
                                    styles.toggleText,
                                    direction === 'YOU_GAVE' && styles.toggleTextActive,
                                ]}>
                                YOU LENT
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                direction === 'YOU_GOT' && styles.toggleButtonActiveGot,
                            ]}
                            onPress={() => setDirection('YOU_GOT')}>
                            <Text
                                style={[
                                    styles.toggleText,
                                    direction === 'YOU_GOT' && styles.toggleTextActive,
                                ]}>
                                YOU BORROWED
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Note Input */}
                <View style={styles.section}>
                    <Text style={styles.label}>Note (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Add a note..."
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={3}
                        placeholderTextColor={theme.colors.textSecondary}
                    />
                </View>

                {/* Date Display */}
                <View style={styles.section}>
                    <Text style={styles.label}>Date</Text>
                    <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyText}>
                            {new Date(date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>
                        {isEditing ? 'Update Transaction' : 'Save Transaction'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    form: {
        padding: theme.spacing.lg,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    input: {
        backgroundColor: theme.colors.cardBackground,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
    },
    readOnlyField: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
    },
    readOnlyText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
    },
    toggleContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    toggleButton: {
        flex: 1,
        padding: theme.spacing.md,
        alignItems: 'center',
        backgroundColor: theme.colors.cardBackground,
    },
    toggleButtonActiveGave: {
        backgroundColor: theme.colors.receive,
    },
    toggleButtonActiveGot: {
        backgroundColor: theme.colors.debt,
    },
    toggleText: {
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    toggleTextActive: {
        color: '#FFFFFF',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
});

export default AddTransactionScreen;
