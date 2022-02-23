import React from 'react';
import { SafeAreaView } from 'react-native';
import ChiaPriceChart from '../../containers/charts/ChiaPriceChart';
import useOrientation from '../../hooks/useOrientation';

const ChiaPriceScreen = ({ route, navigation }) => {
  const { chiaPrice } = route.params;
  const orientation = useOrientation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ChiaPriceChart chiaPrice={chiaPrice} orientation={orientation} />
    </SafeAreaView>
  );
};

export default ChiaPriceScreen;
