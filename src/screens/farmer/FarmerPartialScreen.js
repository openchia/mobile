/* eslint-disable no-plusplus */
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { selectorFamily, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { addMinutes, fromUnixTime, max, min, getUnixTime, toDate, parse } from 'date-fns';
import { getPartialsFromIDTest } from '../../Api';
import { partialRefreshState, selectedPartialBarState } from '../../Atoms';
import { PartChartIntervals } from '../../charts/Constants';
import PartialChartProvider from '../../charts/partial/PartialChartProvider';
import LoadingComponent from '../../components/LoadingComponent';
import useOrientation from '../../hooks/useOrientation';
import PartialChart from './PartialChart';

export const { width } = Dimensions.get('window');

const FarmerPartialScreen = ({ launcherId }) => {
  const orientation = useOrientation();
  // const selectedPoints = useSharedValue(selectedPartialBar);
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
