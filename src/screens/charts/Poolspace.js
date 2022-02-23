import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import PoolspaceChart from '../../containers/charts/PoolspaceChart';
import useOrientation from '../../hooks/useOrientation';

const PoolSpaceScreen = ({ route, navigation }) => {
  const { poolSpace } = route.params;
  const orientation = useOrientation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <PoolspaceChart poolSpace={poolSpace} orientation={orientation} />
    </SafeAreaView>
  );
};

export default PoolSpaceScreen;
