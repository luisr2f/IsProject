/**
 * IsProject - React Native App
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, Portal } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { AppNavigator } from '@/navigation';
import { lightTheme, darkTheme } from '@/theme/paperTheme';
import { globalStyles } from '@/theme/globalStyles';
import { GlobalSnackbar } from '@/components';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={globalStyles.container}>
          <PaperProvider theme={theme}>
            <Portal.Host>
              <SafeAreaProvider>
                <StatusBar
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                />
                <AppNavigator />
                <GlobalSnackbar />
              </SafeAreaProvider>
            </Portal.Host>
          </PaperProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;
