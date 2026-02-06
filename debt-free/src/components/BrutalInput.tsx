import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { theme } from '../styles/theme';

type InputFocusColor = 'violet' | 'pink' | 'cyan' | 'yellow' | 'lime' | 'orange';
type InputRounded = 'none' | 'md' | 'full';

interface BrutalInputProps extends TextInputProps {
    label?: string;
    error?: string;
    focusColor?: InputFocusColor;
    rounded?: InputRounded;
    containerStyle?: ViewStyle;
}

export const BrutalInput: React.FC<BrutalInputProps> = ({
    label,
    error,
    focusColor = 'pink',
    rounded = 'none',
    containerStyle,
    style,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const getFocusBackgroundColor = () => {
        switch (focusColor) {
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
                return theme.colors.pink[200];
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
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                {...textInputProps}
                onFocus={(e) => {
                    setIsFocused(true);
                    textInputProps.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    textInputProps.onBlur?.(e);
                }}
                style={[
                    styles.input,
                    {
                        borderRadius: getBorderRadius(),
                        backgroundColor: isFocused
                            ? getFocusBackgroundColor()
                            : theme.colors.background,
                    },
                    isFocused && theme.shadows.sm,
                    error && styles.inputError,
                    style,
                ]}
                placeholderTextColor={theme.colors.textSecondary}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: theme.borderWidth.base,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        fontWeight: theme.fontWeight.medium,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
        fontWeight: theme.fontWeight.semibold,
    },
});
