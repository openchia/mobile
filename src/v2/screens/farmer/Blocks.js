import { format, fromUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { getFontScale } from 'react-native-device-info';
import { Text, useTheme } from 'react-native-paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { getBlocksFromFarmer, getPayoutsFromAddress, getPayoutsFromAddresses } from '../../../Api';
import {
  farmErrorState,
  farmLoadingState,
  farmState,
  launcherIDsState,
  settingsState,
} from '../../../Atoms';
import PressableCard from '../../../components/PressableCard';
import LoadingComponent from './../../../components/LoadingComponent';
import { convertMojoToChia } from './../../../utils/Formatting';

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
        {/* <Text
              numberOfLines={1}
              style={{ textAlign: 'right', fontSize: 12, color: theme.colors.textGrey }}
            >{`${convertMojoToChia(item.amount)} XCH`}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('id')}</Text>
                <Text style={styles.val}>{item.transaction.confirmed_block_index}</Text>
              </View> */}
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

const FarmerBlockScreen = () => {
  const farms = useRecoilValue(launcherIDsState);
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
    if (state.loading || state.querying || state.refreshing) {
      getBlocksFromFarmer(farms.map((item) => item.launcherId)[0], state.offset, LIMIT).then(
        (response) => {
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
        }
      );
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

export default FarmerBlockScreen;
