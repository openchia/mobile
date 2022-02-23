import { useNetInfo } from '@react-native-community/netinfo';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions, SafeAreaView, StyleSheet,
  View
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import CustomCard from '../../components/CustomCard';
import LoadingComponent from '../../components/LoadingComponent';
import { ticketsRefreshState } from '../../recoil/Atoms';
import { getTicketsFromLauncherIds } from '../../services/Api';

const HEIGHT = 40;

const useRefresh = () => {
  const setRequestId = useSetRecoilState(ticketsRefreshState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'farmerTickets',
  get:
    (launcherIds) =>
    async ({ get }) => {
      get(ticketsRefreshState());
      // const roundResponse = await getRound();
      // if (roundResponse.error) {
      //   throw roundResponse.error;
      // }
      // console.log(launcherIds, roundResponse.results.length);
      const response = await getTicketsFromLauncherIds(launcherIds);
      // console.log(response);
      let allTickets = [];
      response.forEach((element) => {
        // console.log(element);
        element.results.forEach((item) => {
          // console.log(item);
          allTickets = allTickets.concat(item.tickets);
        });
      });
      if (response.error) {
        throw response.error;
      }
      return allTickets.sort((a, b) => a - b);
    },
});

const Item = ({ item, theme, t }) => (
  <CustomCard
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: 8,
      flex: 1,
      marginHorizontal: 4,
      marginVertical: 2,
    }}
    onTap={() => {}}
  >
    <View style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
      <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('ticketNumber')}</Text>
      <Text style={[styles.val, { fontWeight: 'bold' }]}>{item}</Text>
    </View>
  </CustomCard>
);

const Content = ({ navigation, dataProvider, theme, t, width, ticketCount }) => {
  const [layoutProvider] = React.useState(
    new LayoutProvider(
      (index) => 0,
      (type, dim) => {
        dim.width = width;
        dim.height = HEIGHT + 8;
      }
    )
  );

  const rowRenderer = (type, data) => <Item theme={theme} t={t} item={data} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ margin: 16, flexDirection: 'row' }}>
        <Text style={{ marginEnd: 4, fontSize: 16 }}>{t('ticketsIssued')}</Text>
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'right', flex: 1 }}
        >
          {ticketCount}
        </Text>
      </View>
      <RecyclerListView
        // forceNonDeterministicRendering
        rowRenderer={rowRenderer}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        contentContainerStyle={{ paddingBottom: 14 }}
      />
    </SafeAreaView>
  );
};

const TicketsScreen = ({ navigation, launcherIds }) => {
  const ticketsLoadable = useRecoilValueLoadable(query(launcherIds));
  const netInfo = useNetInfo();
  const refresh = useRefresh();
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = Dimensions.get('window');

  if (ticketsLoadable.state === 'hasError') {
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

  if (ticketsLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
  }

  if (ticketsLoadable.contents.length === 0) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
          No tickets received yet.
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

  // let allTickets = [];

  // ticketsLoadable.contents.forEach((element) => {
  //   element.forEach((results) => {
  //     console.log(results);
  //     allTickets = allTickets.concat(results.element.tickets);
  //   });
  // });

  const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
    ticketsLoadable.contents
  );

  return (
    <Content
      ticketCount={ticketsLoadable.contents.length}
      navigation={navigation}
      dataProvider={dataProvider}
      t={t}
      theme={theme}
      width={width}
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

export default TicketsScreen;
