/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import SigninScreen from './src/screens/Signin';
import Dashboard from './src/screens/Dashboard';
import {store, persister} from './src/redux/store';
import Routes from './src/Routes/Routes';
import {ContextProvider} from './src/Context/AppContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
const App = () => {
  if (!__DEV__) {
    console.log = () => null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <SafeAreaProvider>
          <ContextProvider>
            <Routes />
          </ContextProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
