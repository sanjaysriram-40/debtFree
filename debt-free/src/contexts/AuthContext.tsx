import React, { createContext, useState, useContext, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AuthContextType {
    user: FirebaseAuthTypes.User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Configure Google Sign-In
        GoogleSignin.configure({
            webClientId: '629935243184-vflmb8gi97r6e7fcsmdk1dg6i4ib9e2a.apps.googleusercontent.com',
        });

        const unsubscribe = auth().onAuthStateChanged(userState => {
            setUser(userState);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            await auth().signInWithEmailAndPassword(email, password);
        } catch (err: any) {
            setError(getErrorMessage(err.code));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            await auth().createUserWithEmailAndPassword(email, password);
        } catch (err: any) {
            setError(getErrorMessage(err.code));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            setError(null);
            setLoading(true);

            // Check if device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Get user info and ID token
            const userInfo = await GoogleSignin.signIn();

            if (!userInfo.data?.idToken) {
                throw new Error('No ID token received from Google');
            }

            // Create Google credential
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.data.idToken);

            // Sign in with credential
            await auth().signInWithCredential(googleCredential);
        } catch (err: any) {
            console.error('Google Sign-In Error:', err);
            if (err.code === 'SIGN_IN_CANCELLED') {
                setError('Sign in cancelled');
            } else if (err.code === 'IN_PROGRESS') {
                setError('Sign in already in progress');
            } else if (err.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                setError('Play services not available');
            } else {
                setError('Failed to sign in with Google');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            // Sign out from Google
            try {
                await GoogleSignin.signOut();
            } catch (e) {
                // Ignore if not signed in with Google
            }
            await auth().signOut();
        } catch (err: any) {
            setError('Failed to logout');
            throw err;
        }
    };

    const clearError = () => setError(null);

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        loginWithGoogle,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

function getErrorMessage(code: string): string {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection';
        default:
            return 'An error occurred. Please try again';
    }
}
