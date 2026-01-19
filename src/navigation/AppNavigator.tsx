import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@/screens/Login';
import { RegisterScreen } from '@/screens/Register';
import { DashboardScreen } from '@/screens/Dashboard';
import { ClientListScreen } from '@/screens/ClientList';
import { ClientFormScreen } from '@/screens/ClientForm';
import { useAppSelector } from '@/store/hooks';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth?.isAuthenticated ?? false);

  return (
    <NavigationContainer
      key={isAuthenticated ? 'authenticated' : 'unauthenticated'}
    >
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Dashboard' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Pantallas accesibles solo cuando NO está autenticado
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Pantallas accesibles solo cuando está autenticado
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                gestureEnabled: false, // Previene volver atrás desde el dashboard
              }}
            />
            <Stack.Screen name="ClientList" component={ClientListScreen} />
            <Stack.Screen name="ClientForm" component={ClientFormScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
