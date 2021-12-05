import { fromUnixTime, getUnixTime, isAfter } from 'date-fns';
import React, { Suspense, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSetRecoilState, useRecoilValue, selectorFamily } from 'recoil';
import { getMarketChart, getSpace } from '../../Api';
import { currencyState, netSpaceRequestIDState } from '../../Atoms';
import ChiaPriceChart from '../../charts/ChiaPriceChart';
import { NetspaceChartIntervals } from '../../charts/Constants';
import PoolspaceChart from '../../charts/PoolspaceChart';
import LoadingComponent from '../../components/LoadingComponent';
import { monotoneCubicInterpolation } from '../../react-native-animated-charts';
import { formatBytes } from '../../utils/Formatting';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(netSpaceRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const filterData = (data, timePeriod) => {
  const date = new Date(new Date().getTime() - timePeriod * 60 * 60 * 1000);
  return data.filter((item) => isAfter(fromUnixTime(item.x), date));
};

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
