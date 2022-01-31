/* eslint-disable no-plusplus */
import React from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import { useRecoilValue } from 'recoil';
import { launcherIDsState } from '../../../Atoms';
import useOrientation from '../../../hooks/useOrientation';
import PartialChart from '../../../screens/farmer/PartialChart';

export const { width } = Dimensions.get('window');

const FarmerPartialScreen = () => {
  const farms = useRecoilValue(launcherIDsState);

  const orientation = useOrientation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PartialChart launcherIds={farms.map((item) => item.launcherId)} orientation={orientation} />
    </SafeAreaView>
  );
};

export default FarmerPartialScreen;
