// tslint:disable:file-name-casing

import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const instructions = Platform.select({
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },

  instructions: {
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center',
  },
});

const App = (): React.ReactElement<any> => (
  <View style={styles.container}>
    <Text style={styles.welcome}>Welcome to React Native!</Text>
    <Text style={styles.instructions}>To get started, edit App.js</Text>
    <Text style={styles.instructions}>{instructions}</Text>
  </View>
);

export default App;
// tslint:enable:file-name-casing
