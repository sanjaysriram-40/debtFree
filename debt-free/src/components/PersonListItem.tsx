import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import { PersonBalance } from '../types/types';
import { AmountDisplay } from './AmountDisplay';

interface PersonListItemProps {
    personBalance: PersonBalance;
    onPress: () => void;
}

export const PersonListItem: React.FC<PersonListItemProps> = ({
    personBalance,
    onPress,
}) => {
    const { person, netBalance, settled, iOwe } = personBalance;

    const getStatusText = () => {
        if (settled) return 'SETTLED';
        if (iOwe) return 'YOU OWE';
        return 'YOU LENT';
    };

    const getStatusColor = () => {
        if (settled) return theme.colors.settled;
        if (iOwe) return theme.colors.debt;
        return theme.colors.receive;
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.leftSection}>
                <View style={[styles.avatar, { borderColor: getStatusColor() }]}>
                    <Text style={styles.avatarText}>
                        {person.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{person.name}</Text>
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>
                        {getStatusText()}
                    </Text>
                </View>
            </View>

            <View style={styles.rightSection}>
                <AmountDisplay
                    amount={Math.abs(netBalance)}
                    type={settled ? 'settled' : iOwe ? 'owe' : 'receive'}
                />
                <Icon name="chevron-right" size={20} color={theme.colors.border} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
        borderWidth: 1,
    },
    avatarText: {
        color: theme.colors.text,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
});
