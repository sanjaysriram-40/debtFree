import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { initDatabase } from './src/database/database';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import FirebaseService from './src/services/FirebaseService';

const AppContent = () => {
  const [isDbInitialized, setIsDbInitialized] = React.useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        console.log('Database initialized');
        setIsDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (user) {
      FirebaseService.setUserId(user.uid);

      // Download data from cloud first (for multi-device sync)
      FirebaseService.downloadAllData()
        .then(() => console.log('Cloud data downloaded'))
        .catch(err => console.error('Download failed:', err));

      // Perform initial sync (upload local data to cloud)
      FirebaseService.performInitialSync()
        .catch(err => console.error('Initial sync failed:', err));

      // Setup real-time listeners
      FirebaseService.setupRealtimeListeners();
    } else {
      FirebaseService.stopListeners();
      FirebaseService.clearUserId();
    }
  }, [user]);

  if (!isDbInitialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
