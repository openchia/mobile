import React from 'react';
import { Button, View } from 'react-native';

const TestScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Button onPress={() => navigation.navigate('Notifications')} title="Go to notifications" />
  </View>
);

export default TestScreen;
