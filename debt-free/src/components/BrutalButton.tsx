import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    GestureResponderEvent,
    ActivityIndicator,
} from 'react-native';
import { theme } from '../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'violet' | 'pink' | 'orange';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonRounded = 'none' | 'md' | 'full';

interface BrutalButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    rounded?: ButtonRounded;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    rounded = 'none',
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return '#D4D4D4';

        switch (variant) {
            case 'primary':
                return theme.colors.cyan[200];
            case 'secondary':
                return theme.colors.yellow[300];
            case 'success':
                return theme.colors.lime[200];
            case 'error':
                return theme.colors.red[200];
            case 'warning':
                return theme.colors.orange[200];
            case 'violet':
                return theme.colors.violet[200];
            case 'pink':
                return theme.colors.pink[200];
            case 'orange':
                return theme.colors.orange[200];
            default:
                return theme.colors.cyan[200];
        }
    };

    const getSizeStyles = (): ViewStyle => {
        switch (size) {
            case 'sm':
                return {
                    height: 40,
                    paddingHorizontal: theme.spacing.md,
                };
            case 'md':
                return {
                    height: 48,
                    paddingHorizontal: theme.spacing.lg,
                };
            case 'lg':
                return {
                    height: 56,
                    paddingHorizontal: theme.spacing.xl,
                };
        }
    };

    const getBorderRadius = () => {
        switch (rounded) {
            case 'none':
                return theme.borderRadius.none;
            case 'md':
                return theme.borderRadius.md;
            case 'full':
                return theme.borderRadius.full;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.button,
                getSizeStyles(),
                {
                    backgroundColor: getBackgroundColor(),
                    borderRadius: getBorderRadius(),
                    borderColor: disabled ? '#727272' : theme.colors.border,
                },
                !disabled && theme.shadows.md,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={theme.colors.text} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        {
                            color: disabled ? '#676767' : theme.colors.text,
                            fontSize: size === 'sm' ? theme.fontSize.sm : theme.fontSize.md,
                        },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderWidth: theme.borderWidth.base,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontWeight: theme.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
