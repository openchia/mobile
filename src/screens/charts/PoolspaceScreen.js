import { fromUnixTime, getUnixTime, isAfter } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSetRecoilState } from 'recoil';
import { getSpace } from '../../Api';
import { netSpaceRequestIDState } from '../../Atoms';
import { NetspaceChartIntervals } from '../../charts/Constants';
import PoolspaceChart from '../../charts/PoolspaceChart';
import LoadingComponent from '../../components/LoadingComponent';
import { monotoneCubicInterpolation } from '../../react-native-animated-charts';
import { formatBytes } from '../../utils/Formatting';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(netSpaceRequestIDState());
  return () => setRequestId((id) => id + 1);
};

// const filterData = (data, timePeriod) => {
//   const date = new Date(new Date().getTime() - timePeriod * 60 * 60 * 1000);
//   return data.filter((item) => isAfter(fromUnixTime(item.x), date));
// };

const PoolSpaceScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  // const [maxSize, setMaxSize] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useRefresh();
  const [error, setError] = useState();

  useEffect(() => {
    getSpace()
      .then((netspace) => {
        setData(netspace);
        setRefreshing(false);
      })
      .catch((error) => {
        setRefreshing(false);
        setData(null);
        setError(true);
      });
  }, [refreshing, error]);

  useEffect(() => {
    refresh();
  }, [refreshing]);

  if (!data && !refreshing) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
          Cant Connect to Network
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            setError(false);
            refresh();
          }}
        >
          Retry
        </Button>
      </SafeAreaView>
    );
  }

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
        <PoolspaceChart results={data} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PoolSpaceScreen;
