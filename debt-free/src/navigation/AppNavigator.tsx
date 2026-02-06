import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardScreen from '../screens/DashboardScreen';
import { CardsScreen } from '../screens/CardsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import PersonDetailScreen from '../screens/PersonDetailScreen';
import { Person } from '../types/types';

export type RootStackParamList = {
    DashboardMain: undefined;
    PersonDetail: { person: Person };
    AddTransaction: { personId: number };
    CardsMain: undefined;
    Dashboard: undefined;
    Cards: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const DashboardStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="DashboardMain" component={DashboardScreen} />
            <Stack.Screen name="PersonDetail" component={PersonDetailScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
        </Stack.Navigator>
    );
};

const CardsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="CardsMain" component={CardsScreen} />
        </Stack.Navigator>
    );
};

export const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#1a1a1a',
                    borderTopColor: '#333',
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#888',
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="view-dashboard" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cards"
                component={CardsStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="credit-card-multiple" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
