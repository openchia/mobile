/* eslint-disable no-plusplus */
import React from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import PartialChart from '../../containers/charts/PartialChart';
import useOrientation from '../../hooks/useOrientation';

export const { width } = Dimensions.get('window');

const FarmerPartialScreen = ({ route }) => {
  const { launcherIds } = route.params;
  const orientation = useOrientation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PartialChart launcherIds={launcherIds} orientation={orientation} />
    </SafeAreaView>
  );
};

export default FarmerPartialScreen;
