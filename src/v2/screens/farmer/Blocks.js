import { format, fromUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, SafeAreaView, View } from 'react-native';
import { getFontScale } from 'react-native-device-info';
import { Text, useTheme } from 'react-native-paper';
import { useRecoilValue } from 'recoil';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { getBlocksFromFarmer } from '../../../Api';
import { settingsState } from '../../../Atoms';
import PressableCard from '../../../components/PressableCard';
import LoadingComponent from './../../../components/LoadingComponent';

const LIMIT = 20;
const HEIGHT = 50;

const Item = ({ item, theme, t }) => (
  <PressableCard
    style={{
      marginBottom: 1,
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.itemColor,
    }}
    onTap={() => {}}
  >
    <View style={{ marginHorizontal: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          numberOfLines={1}
          style={{ textAlign: 'right', fontSize: 12, color: theme.colors.textGrey }}
        >
          {item.confirmed_block_index}
        </Text>
        <Text
          numberOfLines={1}
          style={{ textAlign: 'right', fontSize: 12, color: theme.colors.textGrey, flex: 1 }}
        >
          {format(fromUnixTime(item.timestamp), 'PPpp')}
        </Text>
      </View>
    </View>
  </PressableCard>
);

const Content = ({ dataState, refresh, state, setState, theme, layoutProvider }) => {
  const rowRenderer = (type, data, index) => <Item item={data} theme={theme} onPress={() => {}} />;

  const loadMore = () => {
    if (state.hasMore && !state.refreshing) {
      setState((prev) => ({ ...prev, offset: prev.offset + LIMIT, querying: true }));
    }
  };

  return (
    <RecyclerListView
      refreshControl={
        <RefreshControl
          refreshing={state.refreshing}
          onRefresh={() => {
            refresh();
          }}
        />
      }
      // contentContainerStyle={{ paddingBottom: 16, paddingTop: 2 }}
      dataProvider={dataState.dataProvider}
      layoutProvider={layoutProvider}
      rowRenderer={rowRenderer}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      renderFooter={() =>
        state.querying && (
          <Text style={{ padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Loading</Text>
        )
      }
    />
  );
};

const FarmerBlockScreen = ({ launcherId }) => {
  const theme = useTheme();
  const { width } = Dimensions.get('window');
  const settings = useRecoilValue(settingsState);
  const [layoutProvider, setLayoutProvider] = useState();

  const [state, setState] = useState({
    loading: true,
    refreshing: false,
    querying: false,
    hasMore: true,
    offset: 0,
  });

  const [dataState, setDataState] = useState({
    dataProvider: new DataProvider((r1, r2) => r1 !== r2),
    data: [],
  });

  useEffect(() => {
    getFontScale().then((fontScale) => {
      setLayoutProvider(
        new LayoutProvider(
          () => 1,
          (type, dim) => {
            dim.width = width;
            dim.height = HEIGHT * fontScale;
          }
        )
      );
    });
  }, [settings.isThemeDark]);

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true, offset: 0 }));
    setDataState((prev) => ({
      ...prev,
      data: [],
    }));
  }, [launcherId]);

  useEffect(() => {
    if (state.loading || state.querying || state.refreshing) {
      getBlocksFromFarmer(launcherId, state.offset, LIMIT).then((response) => {
        setDataState((prev) => ({
          dataProvider: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
            prev.data.concat(response.results)
          ),
          data: prev.data.concat(response.results),
        }));
        setState((prev) => ({
          ...prev,
          loading: false,
          querying: false,
          refreshing: false,
          hasMore: response.results.length === LIMIT,
        }));
      });
    }
  }, [state.loading, state.querying, state.refreshing]);

  if (state.loading) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.divider }}>
      <Content
        theme={theme}
        dataState={dataState}
        width={width}
        refresh={() => {
          setState((prev) => ({ ...prev, refreshing: true, offset: 0 }));
          setDataState((prev) => ({
            ...prev,
            data: [],
          }));
        }}
        state={state}
        setState={setState}
        layoutProvider={layoutProvider}
      />
    </SafeAreaView>
  );
};

export default FarmerBlockScreen;
