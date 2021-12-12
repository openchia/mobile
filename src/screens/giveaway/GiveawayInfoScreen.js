import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { selectorFamily, useSetRecoilState, useRecoilValueLoadable } from 'recoil';
import { useNetInfo } from '@react-native-community/netinfo';
import { format } from 'date-fns';
import LoadingComponent from '../../components/LoadingComponent';
import CustomCard from '../../components/CustomCard';
import { giveawayRequestState } from '../../Atoms';
import { getRound } from '../../Api';
import { convertMojoToChia } from '../../utils/Formatting';
import PlantIcon from '../../images/PlantIcon';

const useRefreshStats = () => {
  const setRequestId = useSetRecoilState(giveawayRequestState());
  return () => setRequestId((id) => id + 1);
};

const statsQuery = selectorFamily({
  key: 'giveaway',
  get:
    () =>
    async ({ get }) => {
      get(giveawayRequestState());
      const round = await getRound();
      if (round.error) {
        throw new Error(round.error);
      }
      // const currency = get(currencyState);
      return { round };
    },
});

const TIERS = [
  { tickets: 1, size: 100 },
  { tickets: 2, size: 100 },
  { tickets: 5, size: 300 },
  { tickets: 10, size: 500 },
  { tickets: 20 },
];

const calculateTicketCount = (val) => {
  let rest = val;
  let newVal = 0;
  TIERS.every((tier) => {
    if (tier.tickets === 20) {
      newVal += Math.floor(rest / tier.tickets);
      return true;
    }
    if (rest > tier.size) {
      newVal += tier.size / tier.tickets;
      rest -= tier.size;
      return true;
    }
    newVal += Math.floor(rest / tier.tickets);
    return false;
  });
  return newVal;
};

const GiveawayInfoSceen = ({ navigation }) => {
  const statsLoadable = useRecoilValueLoadable(statsQuery());
  const refresh = useRefreshStats();
  const netInfo = useNetInfo();
  const theme = useTheme();
  const { t } = useTranslation();

  if (statsLoadable.state === 'loading') {
    return <LoadingComponent />;
  }
  if (statsLoadable.state === 'hasError') {
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

  // console.log(statsLoadable.contents.round.results);

  const data = statsLoadable.contents.round.results;

  return (
    <SafeAreaView style={{ flex: 1, margin: 8 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.colors.drawerSelected,
          padding: 16,
          textAlign: 'center',
        }}
      >
        {t('giveawayEveryone')}
      </Text>
      <View style={styles.container}>
        <CustomCard style={{ flex: 1 }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.title, { color: theme.colors.drawerSelected, fontWeight: 'bold' }]}
            >
              {t('drawDate').toUpperCase()}
            </Text>
            <Text numberOfLines={1} style={styles.val}>
              {format(new Date(data[0].draw_datetime), 'PPpp')}
            </Text>
          </View>
        </CustomCard>
        <View style={{ width: 8 }} />
        <CustomCard style={{ flex: 1 }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.title, { color: theme.colors.drawerSelected, fontWeight: 'bold' }]}
            >
              {t('giveaway').toUpperCase()}
            </Text>
            <Text numberOfLines={1} style={styles.val}>
              {convertMojoToChia(data[0].prize_amount)} XCH
            </Text>
          </View>
        </CustomCard>
      </View>
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <CustomCard style={{ flex: 1 }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.title, { color: theme.colors.drawerSelected, fontWeight: 'bold' }]}
            >
              {t('ticketIssuance').toUpperCase()}
            </Text>
            <Text numberOfLines={1} style={styles.val}>
              DAILY - 00:00 UTC
            </Text>
          </View>
        </CustomCard>
        <View style={{ width: 8 }} />
        <CustomCard style={{ flex: 1 }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.title, { color: theme.colors.drawerSelected, fontWeight: 'bold' }]}
            >
              {t('ticketsIssued').toUpperCase()}
            </Text>
            <Text numberOfLines={1} style={styles.val}>
              {data[0].issued_tickets}
            </Text>
          </View>
        </CustomCard>
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: theme.colors.textGrey }}>{t('ticketDrawing')}</Text>
        </ScrollView>

        <PlantIcon style={{ padding: 8 }} size={180} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    display: 'flex',
  },
  desc: {
    paddingTop: 24,
    fontSize: 14,
    padding: 8,
  },
  title: {
    paddingTop: 24,
    fontSize: 14,
    // marginEnd: 8,
  },
  val: {
    fontSize: 14,
    paddingTop: 4,
    paddingBottom: 24,
    // flex: 1,
  },
});

export default GiveawayInfoSceen;
