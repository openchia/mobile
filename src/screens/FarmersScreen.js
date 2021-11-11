import React, { Suspense, useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControlBase,
  RefreshControl,
  TouchableNativeFeedback,
  Dimensions,
} from 'react-native';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { Text, useTheme } from 'react-native-paper';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { getFarmers } from '../Api';
import { formatBytes } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';
import { farmersRequestIDState } from '../Atoms';
import CustomCard from '../components/CustomCard';
import TouchableRipple from '../components/TouchableRipple';
import PressableCard from '../components/PressableCard';

const HEIGHT = 50;

const Item = ({ item, rank, onPress }) => {
  const theme = useTheme();
  return (
    <PressableCard onPress={onPress}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 12,
          justifyContent: 'center',
          alignItems: 'center',
          height: HEIGHT,
        }}
      >
        <Text style={styles.rank}>{rank}</Text>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: theme.colors.textLight, fontSize: 14 }]}
        >
          {item.name ? item.name : item.launcher_id}
        </Text>
        {/* <Text style={styles.utilization}>{`${item.points_of_total.toFixed(5)}%`}</Text> */}
        <Text style={styles.size}>{formatBytes(item.estimated_size)}</Text>
      </View>
    </PressableCard>
  );
};

const LIMIT = 50;

const Content = ({ navigation, refresh, isLoading, hasMore, setOffset, data, width }) => {
  const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

  const [layoutProvider] = React.useState(
    new LayoutProvider(
      (index) => 1,
      (type, dim) => {
        dim.width = width;
        dim.height = HEIGHT + 8;
      }
    )
  );

  const rowRenderer = (type, data, index) => (
    <Item
      rank={index + 1}
      item={data}
      onPress={() => {
        navigation.navigate({
          name: 'Farmer Details',
          params: { launcherId: data.launcher_id, name: data.name },
        });
      }}
    />
  );

  const loadMore = () => {
    if (hasMore) {
      setOffset((offset) => offset + LIMIT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RecyclerListView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              refresh();
            }}
          />
        }
        contentContainerStyle={{ marginTop: 6, paddingBottom: 14 }}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderFooter={() =>
          isLoading && (
            <Text style={{ padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Loading</Text>
          )
        }
      />
    </SafeAreaView>
  );
};

const FarmersScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { width } = Dimensions.get('window');
  const [data, setData] = useState([]);

  const pulldownRefresh = () => {
    setData([]);
    setIsRefreshing(true);
    setOffset(0);
    setHasMore(true);
  };

  useEffect(() => {
    if (hasMore) {
      setIsLoading(true);
      getFarmers(offset, LIMIT).then((farmers) => {
        setHasMore(farmers.results.length === LIMIT);
        setData([...data, ...farmers.results]);
        setIsRefreshing(false);
        setIsLoading(false);
      });
    }
  }, [offset]);

  if (isRefreshing) return <LoadingComponent />;
  return (
    <Content
      navigation={navigation}
      refresh={pulldownRefresh}
      setOffset={(offset) => setOffset(offset)}
      isLoading={isLoading}
      hasMore={hasMore}
      data={data}
      width={width}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderColor: '#fff', // if you need
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 6,
    display: 'flex',
    flexDirection: 'row',
  },
  rank: {
    fontSize: 14,
    marginEnd: 20,
  },
  name: {
    fontSize: 14,
    marginEnd: 20,
    flex: 1,
  },
  utilization: {
    marginEnd: 20,
    fontSize: 14,
  },
  size: {
    marginLeft: 'auto',
    fontSize: 14,
  },
});

export default FarmersScreen;
