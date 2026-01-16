import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/database';

const App = () => {
  const [isDbInitialized, setIsDbInitialized] = React.useState(false);

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

  if (!isDbInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
