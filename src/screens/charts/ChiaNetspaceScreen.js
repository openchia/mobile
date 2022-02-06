import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import NetspaceChart from '../../charts/ChiaNetspaceChart';
import PoolspaceChart from '../../charts/PoolspaceChart';
import useOrientation from '../../hooks/useOrientation';

const NetspaceScreen = ({ route, navigation }) => {
  const { netspace } = route.params;
  const orientation = useOrientation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <NetspaceChart netspace={netspace} orientation={orientation} />
    </SafeAreaView>
  );
};

export default NetspaceScreen;
