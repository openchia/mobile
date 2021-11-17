import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View, ScrollView } from 'react-native';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { fromUnixTime, getUnixTime, isAfter } from 'date-fns';
import { useTheme } from 'react-native-paper';
import { getSpace } from '../Api';
import LoadingComponent from '../components/LoadingComponent';
import { netSpaceRequestIDState } from '../Atoms';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { monotoneCubicInterpolation } from '../react-native-animated-charts';
import PoolspaceChart from '../charts/PoolspaceChart';
import { NetspaceChartIntervals } from '../charts/Constants';
import { formatBytes } from '../utils/Formatting';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(netSpaceRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const filterData = (data, timePeriod) => {
  const date = new Date(new Date().getTime() - timePeriod * 60 * 60 * 1000);
  return data.filter((item) => isAfter(fromUnixTime(item.x), date));
};

// const netspaceQuery = selectorFamily({
//   key: 'netspaceSelector',
//   get:
//     () =>
//     async ({ get }) => {
//       get(netSpaceRequestIDState());
//       const response = await getNetspace();
//       const convertedData = response.map((item) => ({
//         x: getUnixTime(new Date(item.date)),
//         y: item.size,
//       }));
//       const data = NetspaceChartIntervals.map((item) => {
//         if (item.time === -1) return convertedData;
//         return filterData(convertedData, item.time);
//       });
//       if (response.error) {
//         throw response.error;
//       }
//       return data;
//     },
// });

const Charts = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [maxSize, setMaxSize] = useState('');

  useEffect(() => {
    getSpace().then((netspace) => {
      const convertedData = netspace.map((item) => ({
        x: getUnixTime(new Date(item.date)),
        y: item.size,
      }));
      const filteredData = convertedData.filter((item) => item.y !== 0);
      const data = NetspaceChartIntervals.map((item) => {
        if (item.time === -1)
          return monotoneCubicInterpolation({
            data: filteredData,
            includeExtremes: true,
            range: 100,
          });
        return monotoneCubicInterpolation({
          data: filterData(filteredData, item.time),
          includeExtremes: true,
          range: 100,
        });
      });
      setMaxSize(formatBytes(netspace[netspace.length - 1].size));
      setData(data);
    });
  }, []);

  if (data === null) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <PoolspaceChart data={data} maxSize={maxSize} />
    </SafeAreaView>
  );
};

export default Charts;
