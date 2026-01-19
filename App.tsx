/**
 * IsProject - React Native App
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, Portal } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { AppNavigator } from '@/navigation';
import { lightTheme, darkTheme } from '@/theme/paperTheme';
import { globalStyles } from '@/theme/globalStyles';
import { GlobalSnackbar } from '@/components';
import type { RootState } from '@/store/store';

// Componente interno que verifica rememberMe después de la rehidratación
const AppContent: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const isAuthenticated = authState?.isAuthenticated ?? false;
  const rememberMe = authState?.rememberMe ?? false;
  const [hasCheckedRehydration, setHasCheckedRehydration] = React.useState(false);

  // Verificar una vez después de la rehidratación si hay sesión sin rememberMe
  // Esto limpia sesiones que quedaron del storage de una sesión anterior
  useEffect(() => {
    const checkRehydratedSession = async () => {
      // Esperar suficiente tiempo para que la rehidratación termine
      // y para que cualquier login nuevo se complete
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

      if (!hasCheckedRehydration) {
        const currentAuthState = store.getState().auth;
        // Si hay sesión sin rememberMe, es una sesión rehidratada que debe limpiarse
        // (las sesiones nuevas con rememberMe=false se limpian al pasar a background)
        if (currentAuthState?.isAuthenticated && !currentAuthState?.rememberMe) {
          // Limpiar la sesión rehidratada
          store.dispatch({ type: 'auth/logout' });
          await persistor.purge();
        }
        setHasCheckedRehydration(true);
      }
    };

    checkRehydratedSession();
  }, [hasCheckedRehydration]);

  useEffect(() => {
    // Escuchar cuando la app pasa a background
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Si la app se cierra y rememberMe es false, purgar el storage
        // Esto asegura que la sesión no persista al cerrar la app
        if (isAuthenticated && !rememberMe) {
          persistor.purge();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, rememberMe]);

  return (
    <GestureHandlerRootView style={globalStyles.container}>
      <PaperProvider theme={useColorScheme() === 'dark' ? darkTheme : lightTheme}>
        <Portal.Host>
          <SafeAreaProvider>
            <StatusBar
              barStyle={useColorScheme() === 'dark' ? 'light-content' : 'dark-content'}
            />
            <AppNavigator />
            <GlobalSnackbar />
          </SafeAreaProvider>
        </Portal.Host>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
