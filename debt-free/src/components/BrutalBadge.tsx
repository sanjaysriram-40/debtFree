import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../styles/theme';

type BadgeVariant = 'success' | 'error' | 'warning' | 'violet' | 'pink' | 'cyan';

interface BrutalBadgeProps {
    label: string;
    variant?: BadgeVariant;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const BrutalBadge: React.FC<BrutalBadgeProps> = ({
    label,
    variant = 'cyan',
    style,
    textStyle,
}) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'success':
                return theme.colors.lime[200];
            case 'error':
                return theme.colors.red[200];
            case 'warning':
                return theme.colors.yellow[300];
            case 'violet':
                return theme.colors.violet[200];
            case 'pink':
                return theme.colors.pink[200];
            case 'cyan':
                return theme.colors.cyan[200];
            default:
                return theme.colors.cyan[200];
        }
    };

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: getBackgroundColor(),
                },
                theme.shadows.sm,
                style,
            ]}
        >
            <Text style={[styles.text, textStyle]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderWidth: theme.borderWidth.base,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
