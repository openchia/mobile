import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, View, ScrollView, RefreshControl } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { useNetInfo } from '@react-native-community/netinfo';
import { getPartialsFromIDTest } from '../../Api';
import { partialRefreshState } from '../../Atoms';
import { PartChartIntervals } from '../../charts/Constants';
import PartialChartProvider from '../../charts/partial/PartialChartProvider';
import LoadingComponent from '../../components/LoadingComponent';

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

const FarmerPartialScreen = ({ launcherId }) => {
  const partialsLoadable = useRecoilValueLoadable(query(launcherId));
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const refresh = useRefresh();
  const netInfo = useNetInfo();

  useEffect(() => {
    if (partialsLoadable.state === 'hasValue') {
      const globalData = [];
      const extraData = [];
      let totalPassed = 0;
      let totalFailed = 0;
      PartChartIntervals.forEach((item, index) => {
        const timespan = 3600 * item.interval;
        let startTime =
          Math.floor(partialsLoadable.contents.results[0].timestamp / timespan) * timespan;
        let passed = 0;
        let failed = 0;
        let x = 0;
        const localData = [];
        partialsLoadable.contents.results.forEach((element) => {
          const time = Math.floor(element.timestamp / timespan) * timespan;
          if (startTime === time) {
            if (element.error) {
              failed += 1;
            } else {
              passed += 1;
            }
          } else {
            startTime = time;
            localData[x] = { startTime, failed, passed };
            failed = 0;
            passed = 0;
            x += 1;
          }
        });
        const results = localData.slice(0, item.time / item.interval).reverse();
        results.forEach((item) => {
          totalPassed += item.passed;
          totalFailed += item.failed;
        });
        globalData[index] = results;

        extraData[index] = {
          totalPassed,
          totalFailed,
          time: item.time,
          interval: item.interval,
          label: item.label,
        };
        totalPassed = 0;
        totalFailed = 0;
      });

      setData({ globalData, extraData });

      setRefreshing(false);
    } else if (partialsLoadable.state === 'hasError') {
      setRefreshing(false);
      setData(null);
    }
  }, [partialsLoadable]);

  useEffect(() => {
    refresh();
  }, [refreshing]);

  if (partialsLoadable.state === 'hasError') {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
          Cant Connect to Network
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            if (netInfo.isConnected) refresh();
          }}
        >
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  if (!data && !refreshing) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <PartialChartProvider data={data} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FarmerPartialScreen;
