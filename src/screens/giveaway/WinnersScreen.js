import { useNetInfo } from '@react-native-community/netinfo';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getRound } from '../../Api';
import { giveawayWinnersState } from '../../Atoms';
import CustomCard from '../../components/CustomCard';
import LoadingComponent from '../../components/LoadingComponent';
import { convertMojoToChia } from '../../utils/Formatting';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(giveawayWinnersState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'payouts',
  get:
    () =>
    async ({ get }) => {
      get(giveawayWinnersState());
      const response = await getRound();
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item, theme, t }) => {
  console.log(item);
  return (
    <CustomCard
      style={{ padding: 8, display: 'flex', marginVertical: 4, marginHorizontal: 8 }}
      onTap={() => {}}
    >
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('winner')}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.val, { fontWeight: 'bold', color: theme.colors.drawerSelected }]}
        >
          {item.winner ? item.winner.name || item.winner.launcher_id : 'None'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', paddingTop: 8 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('date')}
        </Text>
        <Text numberOfLines={1} style={styles.val}>
          {format(new Date(item.draw_datetime), 'PPpp')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', paddingTop: 8 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('prize')}
        </Text>
        <Text numberOfLines={1} style={styles.val}>
          {`${convertMojoToChia(item.prize_amount)} XCH`}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', paddingTop: 8 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('issuedTickets')}
        </Text>
        <Text numberOfLines={1} style={styles.val}>
          {item.issued_tickets}
        </Text>
      </View>
    </CustomCard>
  );
};

const WinnersScreen = () => {
  const refresh = useRefresh();
  const roundsLoadable = useRecoilValueLoadable(query());
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const netInfo = useNetInfo();
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    if (roundsLoadable.state === 'hasValue') {
      setData(roundsLoadable.contents.results);
      setRefreshing(false);
    }
  }, [roundsLoadable]);

  const renderItem = ({ item, index }) => <Item item={item} rank={index} theme={theme} t={t} />;

  if (roundsLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
  }

  if (roundsLoadable.state === 'hasError') {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              refresh();
            }}
          />
        }
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.draw_datetime.toString()}
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

export default WinnersScreen;
