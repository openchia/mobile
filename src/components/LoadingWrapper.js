import React, { Suspense } from 'react';
import { SafeAreaView, Text } from 'react-native';

const LoadingWrapper = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <Suspense fallback={<Text>Loading...</Text>}>{children}</Suspense>
  </SafeAreaView>
);

export default LoadingWrapper;
