import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import { PersonBalance } from '../types/types';
import { AmountDisplay } from './AmountDisplay';
import { BrutalCard } from './BrutalCard';

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
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
            <BrutalCard color="white" shadowSize="md" style={styles.container}>
                <View style={styles.leftSection}>
                    <View style={[styles.avatar, { backgroundColor: getStatusColor() }]}>
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
                    <Icon name="chevron-right" size={20} color={theme.colors.text} />
                </View>
            </BrutalCard>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        marginBottom: theme.spacing.md,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
        borderWidth: theme.borderWidth.thick,
        borderColor: theme.colors.border,
    },
    avatarText: {
        color: theme.colors.text,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.black,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: theme.fontWeight.bold,
        letterSpacing: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
});
