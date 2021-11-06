import React from 'react';
import { Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoadingComponent = () => (
  <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size={60} color="#119400" />
  </SafeAreaView>
);

export default LoadingComponent;
