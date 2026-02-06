export const theme = {
    colors: {
        // Neo-Brutalism Color Palette
        violet: {
            100: '#9B99FF',
            200: '#8B88FF',
            300: '#7B77FF',
            400: '#6B66FF',
        },
        pink: {
            200: '#FF88EE',
            300: '#FF66E8',
            400: '#FF44E2',
        },
        red: {
            200: '#FF6B6B',
            300: '#FF4444',
            400: '#FF2222',
        },
        orange: {
            200: '#FFAA66',
            300: '#FF8833',
            400: '#FF6600',
        },
        yellow: {
            200: '#FFE066',
            300: '#FFD700',
            400: '#FFC700',
        },
        lime: {
            100: '#A8FF88',
            200: '#88FF66',
            300: '#66FF44',
            400: '#44FF22',
        },
        cyan: {
            200: '#00D4FF',
            300: '#00BBFF',
            400: '#00A2FF',
        },

        // Semantic colors (mapped to darker Neo-Brutalism palette)
        primary: '#00D4FF', // cyan-200 (darker)
        secondary: '#FFD700', // yellow-300 (darker)
        accent: '#FFAA66', // orange-200
        success: '#88FF66', // lime-200 (darker)
        error: '#FF6B6B', // red-200 (darker)
        warning: '#FFD700', // yellow-300

        // Base colors
        background: '#FAFAFA', // Very light gray instead of pure white
        surface: '#F0F0F0', // Light gray for surfaces
        cardBackground: '#FFFFFF',

        // Text colors - ensuring high contrast
        text: '#000000', // Black text for high contrast
        textSecondary: '#333333', // Darker gray
        textTertiary: '#666666',

        // Border and shadows
        border: '#000000', // Always black borders
        shadow: '#000000',

        // Transaction-specific colors (darker for visibility)
        debt: '#FF6B6B', // red-200 (darker)
        receive: '#88FF66', // lime-200 (darker)
        settled: '#999999',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
        xxl: 32,
        xxxl: 40,
    },
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },
    borderWidth: {
        none: 0,
        thin: 1,
        base: 2,
        thick: 3,
        heavy: 4,
    },
    // Hard shadows (offset with no blur) - Neo-Brutalism signature
    shadows: {
        none: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        sm: {
            shadowColor: '#000000',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 2,
        },
        md: {
            shadowColor: '#000000',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000000',
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 6,
        },
        xl: {
            shadowColor: '#000000',
            shadowOffset: { width: 8, height: 8 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 8,
        },
    },
    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
        black: '900' as const,
    },
};

