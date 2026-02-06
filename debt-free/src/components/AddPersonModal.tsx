import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import FirebaseService from '../services/FirebaseService';

interface AddPersonModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
}

export const AddPersonModal: React.FC<AddPersonModalProps> = ({
    visible,
    onClose,
    onSave,
}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        try {
            await FirebaseService.addPerson(name.trim(), phone.trim() || undefined, notes.trim() || undefined);
            setName('');
            setPhone('');
            setNotes('');
            setError(null);
            onSave();
        } catch (err) {
            console.error('Error creating person:', err);
            setError('Failed to save person');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>ADD NEW PERSON</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>NAME</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter name"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PHONE (OPTIONAL)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter phone number"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>NOTES (OPTIONAL)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Add some notes"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={notes}
                                onChangeText={setNotes}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>SAVE PERSON</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 2,
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: theme.spacing.xl,
    },
    inputGroup: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        letterSpacing: 1,
        marginBottom: theme.spacing.sm,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    errorText: {
        color: theme.colors.error,
        marginBottom: theme.spacing.md,
        fontSize: theme.fontSize.sm,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    saveButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
        letterSpacing: 1,
    },
});
