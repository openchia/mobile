import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { getFontScale } from 'react-native-device-info';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { getFarmers } from '../Api';
import LoadingComponent from '../components/LoadingComponent';
import PressableCard from '../components/PressableCard';
import { formatBytes } from '../utils/Formatting';
import { farmerSearchBarPressedState, farmerSearchBarTextState, settingsState } from '../Atoms';
import { isAfter } from 'date-fns';

const HEIGHT = 50;

const rankIcon = ['🥇', '🥈', '🥉'];

const CustomRank = ({ item, color, children, style, rank, previousTime }) => {
  const theme = useTheme();
  if (rank < 4) {
    return (
      <View
        style={[
          {
            // backgroundColor: theme.colors.dividerColor,
            // padding: 2,
            width: 24,
            hieght: 36,
            display: 'flex',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
      >
        <View style={{ alignSelf: 'center' }}>
          <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 24 }}>
            {rankIcon[rank - 1]}
          </Text>
        </View>
      </View>
    );
  }
  if (isAfter(new Date(item.joined_at), previousTime)) {
    if (item.difficulty > 100) {
      return (
        <View
          style={[
            {
              // backgroundColor: theme.colors.dividerColor,
              // padding: 2,
              width: 24,
              hieght: 36,
              display: 'flex',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            },
            style,
          ]}
        >
          <View style={{ alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 24 }}>
              🚀
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View
        style={[
          {
            // backgroundColor: theme.colors.dividerColor,
            // padding: 2,
            width: 24,
            hieght: 36,
            display: 'flex',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
      >
        <View style={{ alignSelf: 'center' }}>
          <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 24 }}>👶</Text>
        </View>
      </View>
    );
  }
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.dividerColor,
          // padding: 2,
          width: 24,
          hieght: 36,
          display: 'flex',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <View style={{ alignSelf: 'center' }}>
        <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 14 }}>
          {children}
        </Text>
      </View>
    </View>
  );
};

const CustomText = ({ text, color, children, style }) => {
  const theme = useTheme();
  return (
    <Text
      numberOfLines={1}
      style={[styles.title, { color: color || theme.colors.textGrey, fontSize: 12 }, style]}
    >
      {children}
    </Text>
  );
};

const Item = ({ item, rank, onPress, previousTime }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = Dimensions.get('window');

  return (
    <>
      <PressableCard
        style={{
          // display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          // marginVertical: 2,
          // flexDirection: 'row',
          borderRadius: 0,
          // padding: 16,
          // marginHorizontal: 8,
          // width: '100%',
          marginBottom: 2,
          flex: 1,
          // justifyContent: 'center',
          // flex: 1,
          // alignItems: 'center',
          // height: HEIGHT,
        }}
        onPress={onPress}
      >
        <View style={{ marginHorizontal: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <CustomText>Launcher ID</CustomText> */}
            <CustomRank
              previousTime={previousTime}
              rank={rank}
              item={item}
              style={{ marginEnd: 8 }}
            >
              {rank}
            </CustomRank>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              {/* <CustomText style={{ fontSize: 14, width: width / 2 }}>
                {item.name ? item.name : item.launcher_id}
              </CustomText> */}
              <CustomText style={{ fontSize: 13, paddingEnd: 16, color: theme.colors.textLight }}>
                {item.name ? item.name : item.launcher_id}
              </CustomText>
            </View>
            {/* <CustomText style={{ textAlign: 'right', flex: 0.6, paddingEnd: 2 }}>
              {item.difficulty}
            </CustomText> */}
            {/* <View style={{ flex: 1, backgroundColor: 'blue' }}></View> */}
            <View style={{ flexDirection: 'column' }}>
              <CustomText style={{ textAlign: 'right' }}>
                {formatBytes(item.estimated_size)}
              </CustomText>
              <CustomText style={{ textAlign: 'right' }}>{`${item.points_of_total.toFixed(
                2
              )}%`}</CustomText>
            </View>
          </View>
          {/* <View style={{ flexDirection: 'row' }}>
            <CustomText numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
              {t('rank')}
            </CustomText>
            <CustomRank>{rank}</CustomRank>
            <CustomText numberOfLines={1} style={[styles.val, { fontWeight: 'bold' }]}>
              {rank}
            </CustomText>
          </View> */}
          {/* <View style={{ flexDirection: 'row' }}>
            <CustomText numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
              {t('points')}
            </CustomText>
            <CustomText numberOfLines={1} style={styles.val}>
              {item.points}
            </CustomText>
          </View> */}
          {/* <View style={{ flexDirection: 'row' }}>
            <CustomText numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
              {t('difficulty')}
            </CustomText>
            <CustomText numberOfLines={1} style={styles.val}>
              {item.difficulty}
            </CustomText>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <CustomText numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
              {t('utilizationSpace')}
            </CustomText>
            <CustomText numberOfLines={1} style={styles.val}>{`${item.points_of_total.toFixed(
              5
            )}%`}</CustomText>
          </View> */}
          {/* <View style={{ flexDirection: 'row' }}>
            <CustomText numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
              {t('estimatedSize')}
            </CustomText>
            <CustomText numberOfLines={1} style={styles.val}>
              {formatBytes(item.estimated_size)}
            </CustomText>
          </View> */}
        </View>
        {/* <View
          style={{ height: 1, backgroundColor: theme.colors.dividerColor, marginHorizontal: 8 }}
        ></View> */}
      </PressableCard>
    </>
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
  isSearching,
  fontScale,
}) => {
  // const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);
  const { width } = Dimensions.get('window');
  const millis = Date.now() - 3600 * 1000 * 24;
  const previousTime = new Date(millis);

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
      previousTime={previousTime}
      onPress={() => {
        navigation.navigate({
          name: 'Farmer',
          // name: 'Farmer Details',
          params: { data: { launcherId: data.launcher_id, name: data.name }, isGroup: false },
          // params: { launcherId: data.launcher_id, name: data.name },
        });
      }}
    />
  );

  const loadMore = () => {
    // if (hasMore && !isSearching) {
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
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 0 }}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderFooter={() =>
          isQuerying &&
          !isSearching && (
            <Text style={{ padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Loading</Text>
          )
        }
      />
    </SafeAreaView>
  );
};

const FarmersScreen = ({ navigation }) => {
  const [loadState, setLoadState] = useState({ loading: true, refreshing: false, querying: false });
  const [settings, setSettings] = useRecoilState(settingsState);
  const [searchText, setSearchText] = useRecoilState(farmerSearchBarTextState);
  const [searchPressed, setSearchPressed] = useRecoilState(farmerSearchBarPressedState);
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
    if (searchPressed) {
      setLoadState((prevState) => ({ ...prevState, refreshing: true }));
      setLoading(true);
      setData([]);
      setOffset(0);
      setHasMore(true);
    }
  }, [searchPressed]);

  useEffect(() => {
    if (data.length > 0 || searchPressed) {
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
      getFarmers(offset, LIMIT, searchText, settings.showOnlyActiveFarmers)
        .then((farmers) => {
          if (searchPressed) {
            if (farmers.results.length === 1) {
              setHasMore(farmers.results.length === LIMIT);
              setData([...data, ...farmers.results]);
              setLoading(false);
              setLoadState({ loading: false, refreshing: false, querying: false });
            } else if (farmers.results.length === 0) {
              setHasMore(false);
              setData([]);
              setOffset(0);
              setLoadState({ loading: false, refreshing: false, querying: false });
              setLoading(false);
            } else {
              setHasMore(farmers.results.length === LIMIT);
              setData([...data, ...farmers.results]);
              setLoadState({ loading: false, refreshing: false, querying: false });
              setLoading(false);
            }
          } else {
            setHasMore(farmers.results.length === LIMIT);
            setData([...data, ...farmers.results]);
            setLoadState({ loading: false, refreshing: false, querying: false });
            setLoading(false);
          }
          setSearchPressed(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setLoadState({ loading: false, refreshing: false, querying: false });
          setError(true);
          setSearchPressed(false);
        });
    }
  }, [loading, settings]);

  if (loadState.loading || !fontScale) return <LoadingComponent />;
  if (error) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 16 }}>
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
      isSearching={searchPressed}
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
