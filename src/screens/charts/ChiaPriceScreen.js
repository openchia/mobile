import React, { useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import ChiaPriceChart from '../../charts/ChiaPriceChart';

const ChiaPriceScreen = ({ route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { chiaPrice } = route.params;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 6, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
            }}
          />
        }
      >
        <ChiaPriceChart chiaPrice={chiaPrice} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChiaPriceScreen;
