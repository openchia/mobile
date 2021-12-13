import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { BaseItemAnimator, DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { getFontScale } from 'react-native-device-info';
import { getFarmers } from '../Api';
import LoadingComponent from '../components/LoadingComponent';
import PressableCard from '../components/PressableCard';
import { formatBytes } from '../utils/Formatting';

const HEIGHT = 140;

const Item = ({ item, rank, onPress }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    // <View style={{ width: '100%' }}>
    <PressableCard
      style={{
        // display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginVertical: 2,
        // flexDirection: 'row',

        padding: 8,
        marginHorizontal: 8,
        // width: '100%',
        flex: 1,
        // justifyContent: 'center',
        // flex: 1,
        // alignItems: 'center',
        // height: HEIGHT,
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          Launcher ID
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.val, { color: theme.colors.textLight, fontWeight: 'bold' }]}
        >
          {item.name ? item.name : item.launcher_id}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('rank')}
        </Text>
        <Text numberOfLines={1} style={[styles.val, { fontWeight: 'bold' }]}>
          {rank}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('points')}
        </Text>
        <Text numberOfLines={1} style={styles.val}>
          {item.points}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('difficulty')}
        </Text>
        <Text numberOfLines={1} style={styles.val}>
          {item.difficulty}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('utilizationSpace')}
        </Text>
        <Text numberOfLines={1} style={styles.val}>{`${item.points_of_total.toFixed(5)}%`}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('estimatedSize')}
        </Text>
        <Text numberOfLines={1} style={styles.val}>
          {formatBytes(item.estimated_size)}
        </Text>
      </View>
    </PressableCard>
    // </View>
  );
};

const LIMIT = 50;

const Content = ({
  navigation,
  hasMore,
  setOffset,
  dataProvider,
  queryMoreData,
  isQuerying,
  refresh,
  isRefreshing,
  fontScale,
}) => {
  // const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);
  const { width } = Dimensions.get('window');

  const [layoutProvider] = React.useState(
    new LayoutProvider(
      (index) => 1,
      (type, dim) => {
        dim.width = width;
        dim.height = HEIGHT * fontScale;
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
        contentContainerStyle={{ marginTop: 8 }}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        onEndReached={loadMore}
        // itemAnimator={new BaseItemAnimator()}
        onEndReachedThreshold={0.5}
        // canChangeSize
        // forceNonDeterministicRendering
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
  const [loadState, setLoadState] = useState({ loading: true, refreshing: false, querying: false });
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState([]);
  const [dataProvider, setDataProvider] = useState();
  const [error, setError] = useState();
  const netInfo = useNetInfo();
  const [fontScale, setFontScale] = useState();

  useEffect(() => {
    getFontScale().then((fontScale) => {
      setFontScale(fontScale || 1);
    });
  }, []);

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
      getFarmers(offset, LIMIT)
        .then((farmers) => {
          setHasMore(farmers.results.length === LIMIT);
          setData([...data, ...farmers.results]);
          setLoadState({ loading: false, refreshing: false, querying: false });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setLoadState({ loading: false, refreshing: false, querying: false });
          setError(true);
        });
    }
  }, [loading]);

  if (loadState.loading || !fontScale) return <LoadingComponent />;
  if (error) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
          Cant Connect to Network
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            if (netInfo.isConnected) {
              setLoadState({ loading: true, refreshing: false, querying: false });
              setLoading(true);
              setError(false);
            }
          }}
        >
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <Content
      navigation={navigation}
      setOffset={(offset) => setOffset(offset)}
      hasMore={hasMore}
      dataProvider={dataProvider}
      refresh={pulldownRefresh}
      queryMoreData={queryMoreData}
      isQuerying={loadState.querying}
      isRefreshing={loadState.refreshing}
      fontScale={fontScale}
    />
  );
};

const styles = StyleSheet.create({
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
