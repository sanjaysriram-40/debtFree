import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Person, Transaction } from '../types/types';
import DashboardScreen from '../screens/DashboardScreen';
import PersonDetailScreen from '../screens/PersonDetailScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import { CardsScreen } from '../screens/CardsScreen';

export type RootStackParamList = {
    Dashboard: undefined;
    PersonDetail: { person: Person };
    AddTransaction: { person: Person; transaction?: Transaction };
    Cards: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Debt Free' }}
            />
            <Stack.Screen
                name="PersonDetail"
                component={PersonDetailScreen}
                options={{ title: 'Person Details' }}
            />
            <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={{ title: 'Add Transaction' }}
            />
            <Stack.Screen
                name="Cards"
                component={CardsScreen}
                options={{ title: 'My Cards' }}
            />
        </Stack.Navigator>
    );
};
