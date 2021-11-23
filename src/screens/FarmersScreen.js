import React, { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { useTranslation } from 'react-i18next';
import { getFarmers } from '../Api';
import LoadingComponent from '../components/LoadingComponent';
import PressableCard from '../components/PressableCard';
import { formatBytes } from '../utils/Formatting';

const HEIGHT = 142;

const Item = ({ item, rank, onPress }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <PressableCard onPress={onPress}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          // flexDirection: 'row',
          padding: 8,
          justifyContent: 'center',
          // alignItems: 'center',
          height: HEIGHT,
        }}
      >
        {/* <Text style={styles.rank}>{rank}</Text>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: theme.colors.textLight, fontSize: 14 }]}
        >
          {item.name ? item.name : item.launcher_id}
        </Text>
        <Text style={styles.utilization}>{`${item.points_of_total.toFixed(5)}%`}</Text>
        <Text style={styles.size}>{formatBytes(item.estimated_size)}</Text> */}
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>Launcher ID</Text>
          <Text
            numberOfLines={1}
            style={[styles.val, { color: theme.colors.textLight, fontWeight: 'bold' }]}
          >
            {item.name ? item.name : item.launcher_id}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('rank')}</Text>
          <Text style={[styles.val, { fontWeight: 'bold' }]}>{rank}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('points')}</Text>
          <Text style={styles.val}>{item.points}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('difficulty')}</Text>
          <Text style={styles.val}>{item.difficulty}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>
            {t('utilizationSpace')}
          </Text>
          <Text style={styles.val}>{`${item.points_of_total.toFixed(5)}%`}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('estimatedSize')}</Text>
          <Text style={styles.val}>{formatBytes(item.estimated_size)}</Text>
        </View>
      </View>
    </PressableCard>
  );
};

const LIMIT = 50;

const Content = ({
  navigation,
  hasMore,
  setOffset,
  dataProvider,
  width,
  queryMoreData,
  isQuerying,
  refresh,
  isRefreshing,
}) => {
  // const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

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
        console.log(data);
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
      queryMoreData();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RecyclerListView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
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
          isQuerying && (
            <Text style={{ padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Loading</Text>
          )
        }
      />
    </SafeAreaView>
  );
};

const FarmersScreen = ({ navigation }) => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [isRefreshing, setIsRefreshing] = useState(false);
  // const [initalLoading, setIntialLoading] = useState(true);
  const [loadState, setLoadState] = useState({ loading: true, refreshing: false, querying: false });
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { width } = Dimensions.get('window');
  const [data, setData] = useState([]);
  const [dataProvider, setDataProvider] = useState();

  useEffect(() => {
    if (data.length > 0) {
      setDataProvider(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data));
    }
  }, [data]);

  const pulldownRefresh = () => {
    setLoadState((prevState) => ({ ...prevState, refreshing: true }));
    setLoading(true);
    setData([]);
    setOffset(0);
    setHasMore(true);
  };

  const queryMoreData = () => {
    setLoadState((prevState) => ({ ...prevState, querying: true }));
    setLoading(true);
  };

  useEffect(() => {
    if (hasMore && (loadState.loading || loadState.refreshing || loadState.querying)) {
      getFarmers(offset, LIMIT).then((farmers) => {
        setHasMore(farmers.results.length === LIMIT);
        setData([...data, ...farmers.results]);
        setLoadState({ loading: false, refreshing: false, querying: false });
        setLoading(false);
      });
    }
  }, [loading]);

  if (loadState.loading) return <LoadingComponent />;
  return (
    <Content
      navigation={navigation}
      setOffset={(offset) => setOffset(offset)}
      hasMore={hasMore}
      width={width}
      dataProvider={dataProvider}
      refresh={pulldownRefresh}
      queryMoreData={queryMoreData}
      isQuerying={loadState.querying}
      isRefreshing={loadState.refreshing}
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
  title: {
    fontSize: 14,
    marginEnd: 8,
  },
  val: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
});

export default FarmersScreen;
