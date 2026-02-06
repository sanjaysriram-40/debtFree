import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

type CardColor = 'white' | 'violet' | 'pink' | 'cyan' | 'yellow' | 'lime' | 'orange';

interface BrutalCardProps {
    children: React.ReactNode;
    color?: CardColor;
    shadowSize?: 'sm' | 'md' | 'lg' | 'xl';
    style?: ViewStyle;
}

export const BrutalCard: React.FC<BrutalCardProps> = ({
    children,
    color = 'white',
    shadowSize = 'md',
    style,
}) => {
    const getBackgroundColor = () => {
        switch (color) {
            case 'white':
                return theme.colors.cardBackground;
            case 'violet':
                return theme.colors.violet[200];
            case 'pink':
                return theme.colors.pink[200];
            case 'cyan':
                return theme.colors.cyan[200];
            case 'yellow':
                return theme.colors.yellow[200];
            case 'lime':
                return theme.colors.lime[200];
            case 'orange':
                return theme.colors.orange[200];
            default:
                return theme.colors.cardBackground;
        }
    };

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: getBackgroundColor(),
                },
                theme.shadows[shadowSize],
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: theme.borderWidth.base,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
    },
});
