/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import SigninScreen from './src/screens/Signin'
import Dashboard from './src/screens/Dashboard'
import { store, persister } from './src/redux/store';
import Routes from './src/Routes/Routes'
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <Routes />
      </PersistGate>
    </Provider>
  );
};



const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});

export default App;
