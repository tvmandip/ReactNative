/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import UserList from './src/UserList';
import Navigation from './src/Navigation';

const App = () => {
  return (
    <>
      <Navigation />
    </>
  );
};


export default App;
