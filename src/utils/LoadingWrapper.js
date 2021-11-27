import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import LoadingComponent from '../components/LoadingComponent';

const LoadingWrapper = ({ children, loadable, onRetry, refreshing }) => {
  if (loadable.state === 'loading') {
    return <LoadingComponent />;
  }
  if (loadable.state === 'hasError') {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
          Cant Connect to Network
        </Text>
        <Button mode="contained" onPress={onRetry}>
          Retry
        </Button>
      </SafeAreaView>
    );
  }
  //   if (refreshing) setRefreshing(false);
  return children;
};

export default LoadingWrapper;
