import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import NetspaceChart from '../../containers/charts/ChiaNetspaceChart';
import useOrientation from '../../hooks/useOrientation';

const Netspace = ({ route, navigation }) => {
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

export default Netspace;
