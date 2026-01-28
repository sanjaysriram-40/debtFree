import Clipboard from '@react-native-clipboard/clipboard';
import { Alert, ToastAndroid, Platform } from 'react-native';

/**
 * Copies text to the clipboard and provides visual feedback.
 * @param text The text to copy
 * @param label A label describing the text (e.g., "Card Number")
 */
export const copyToClipboard = (text: string, label: string = 'Content') => {
    if (!text) return;

    Clipboard.setString(text);

    if (Platform.OS === 'android') {
        ToastAndroid.show(`${label} copied!`, ToastAndroid.SHORT);
    } else {
        Alert.alert('Copied', `${label} has been copied to clipboard.`);
    }
};
