/* eslint-disable no-plusplus */
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { addMinutes, fromUnixTime, max, min, getUnixTime, toDate, parse } from 'date-fns';
import { getPartialsFromIDTest } from '../../Api';
import { partialRefreshState } from '../../Atoms';
import { PartChartIntervals } from '../../charts/Constants';
import PartialChartProvider from '../../charts/partial/PartialChartProvider';
import LoadingComponent from '../../components/LoadingComponent';
import useOrientation from '../../hooks/useOrientation';
import PartialChart from './PartialChart';

export const { width } = Dimensions.get('window');

const useRefresh = () => {
  const setRequestId = useSetRecoilState(partialRefreshState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'farmerPartials',
  get:
    (launcherId) =>
    async ({ get }) => {
      get(partialRefreshState());
      let timestamp = new Date().getTime();
      timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24 * 30;
      const response = await getPartialsFromIDTest(launcherId, timestamp);
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const getTotalChartData = (data, maxDate, numHours, numBars, label) => {
  const results = [];
  const minuteGap = (numHours * 60) / numBars;
  let totalPassed = 0;
  let totalFailed = 0;
  let x = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
  while (x <= maxDate) x = addMinutes(x, minuteGap);
  let periodStart = addMinutes(x, -minuteGap * numBars);
  let k = data.length - 1;
  while (k >= 0 && fromUnixTime(data[k].timestamp) < periodStart) k--;
  for (let i = 0; i < numBars; i++) {
    let numSuccess = 0;
    let numFailed = 0;
    const periodEnd = addMinutes(periodStart, minuteGap);
    while (
      k >= 0 &&
      fromUnixTime(data[k].timestamp) >= periodStart &&
      fromUnixTime(data[k].timestamp) < periodEnd
    ) {
      if (!data[k].error) numSuccess++;
      else numFailed++;
      k--;
    }
    results.push({
      passed: numSuccess,
      failed: numFailed,
      time: {
        start: getUnixTime(periodStart),
        end: getUnixTime(periodEnd),
      },
    });
    totalPassed += numSuccess;
    totalFailed += numFailed;
    periodStart = periodEnd;
  }
  return { results, stats: { passed: totalPassed, failed: totalFailed, label } };
};

const FarmerPartialScreen = ({ launcherId }) => {
  const orientation = useOrientation();
  // const partialsLoadable = useRecoilValueLoadable(query(launcherId));
  // const [refreshing, setRefreshing] = useState(false);
  // const [data, setData] = useState(null);
  // const refresh = useRefresh();
  // const netInfo = useNetInfo();

  // useEffect(() => {
  //   if (partialsLoadable.state === 'hasValue') {
  //     const globalData = [];
  //     const data1 = partialsLoadable.contents.results;
  //     const maxDate = max(data1.map((item) => fromUnixTime(item.timestamp)));
  //     PartChartIntervals.forEach((item, index) => {
  //       globalData[index] = getTotalChartData(data1, maxDate, item.time, 12, item.label);
  //     });

  //     setData(globalData);

  //     setRefreshing(false);
  //   } else if (partialsLoadable.state === 'hasError') {
  //     setRefreshing(false);
  //     setData(null);
  //   }
  // }, [partialsLoadable]);

  // useEffect(() => {
  //   refresh();
  // }, [refreshing]);

  // if (partialsLoadable.state === 'hasError') {
  //   return (
  //     <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
  //       <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
  //         Cant Connect to Network
  //       </Text>
  //       <Button
  //         mode="contained"
  //         onPress={() => {
  //           if (netInfo.isConnected) refresh();
  //         }}
  //       >
  //         Retry
  //       </Button>
  //     </SafeAreaView>
  //   );
  // }

  // if (!data && !refreshing) {
  //   return <LoadingComponent />;
  // }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PartialChart launcherId={launcherId} orientation={orientation} />
    </SafeAreaView>
  );
};

export default FarmerPartialScreen;
