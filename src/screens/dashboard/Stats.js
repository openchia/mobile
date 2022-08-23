/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, toDate } from 'date-fns';
import humanizeDuration from 'humanize-duration';
import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import {
  useRecoilStateLoadable,
  useRecoilValue,
  useRecoilRefresher_UNSTABLE as useRecoilRefresher,
} from 'recoil';
import CustomCard from '../../components/CustomCard';
import { dashboardState, settingsState } from '../../recoil/Atoms';
import { apiMulti } from '../../services/Api';

const Item = ({ title, color, loading, value, format, settings }) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, margin: 6 }}>
      <Shadow
        distance={6}
        startColor="rgba(0, 0, 0, 0.02)"
        finalColor="rgba(0, 0, 0, 0.0)"
        radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
        viewStyle={{ height: '100%', width: '100%' }}
      >
        <CustomCard
          style={{
            borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
            backgroundColor: theme.colors.onSurfaceLight,
            flex: 1,
            // alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text numberOfLines={1} style={{ color, fontSize: 13, textAlign: 'center' }}>
            {title}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              // fontSize: 16,
              // fontWeight: 'bold',
            }}
          >
            {!loading && value ? format(value) : '...'}
          </Text>
        </CustomCard>
      </Shadow>
    </View>
  );
};

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  conjunction: ' ',
  delimiter: ' ',
  serialComma: false,
  spacer: '',
  largest: 3,
  // serialComma: false,
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
  },
});

const FarmerStatsScreen = ({ launcherIds, selected, farmData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useRecoilValue(settingsState);
  // const [data, setData] = useState();
  // const [loading, setLoading] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  // const [dashboard, setDashboard] = useRecoilStateLoadable(dashboardState);
  const refreshDashboard = useRecoilRefresher(dashboardState);
  const [data, setData] = useState();

  useEffect(() => {
    if (!loading) {
      let mPoints = 0;
      let mPointsPPLNS = 0;
      let mSharePPLNS = 0;
      let mDifficulty = 0;
      let mEstimatedSize = 0;
      let mTotalPaid = 0;
      let mTotalUnpaid = 0;
      let mTotalTransactions = 0;
      let mBlocksTotal = 0;
      let mCurrentETW = 0;
      let mCurrentEffort = 0;
      let mFee = 0;
      const mJoinedLastAt = [];
      const mJoinedAt = [];

      farmData.forEach((farm) => {
        const {
          points,
          points_pplns,
          share_pplns,
          difficulty,
          estimated_size,
          joined_at,
          joined_last_at,
          current_etw,
          current_effort,
        } = farm;
        const { total_paid, total_unpaid, total_transactions } = farm.payout;
        const { final } = farm.fee;
        const { total } = farm.blocks;
        mPoints += points;
        mPointsPPLNS += points_pplns;
        mSharePPLNS += Number(share_pplns) / farmData.length;
        mDifficulty += difficulty;
        mEstimatedSize += estimated_size;
        mTotalPaid += total_paid;
        mTotalUnpaid += total_unpaid;
        mTotalTransactions += total_transactions;
        mBlocksTotal += total;
        mJoinedLastAt.push(joined_last_at);
        mJoinedAt.push(joined_at);
        mCurrentETW += current_etw;
        mCurrentEffort += current_effort;
        mFee += final;
      });

      setData({
        points: mPoints,
        pointsPPLNS: mPointsPPLNS,
        share_pplns: mSharePPLNS,
        difficulty: mDifficulty,
        estimatedSize: mEstimatedSize,
        totalPaid: mTotalPaid,
        totalUnpaid: mTotalUnpaid,
        totalTransactions: mTotalTransactions,
        blocksTotal: mBlocksTotal,
        etw: mCurrentETW / farmData.length,
        effort: mCurrentEffort / farmData.length,
        joinedLastAt: mJoinedLastAt,
        joinedAt: mJoinedAt,
        fee: mFee / farmData.length,
      });
    }
  }, [farmData, selected]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingTop: 6, paddingBottom: 6, marginHorizontal: 6, flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            refreshDashboard();
            // setRefresh((prev) => !prev);
          }}
        />
      }
    >
      <View style={styles.container}>
        <Item
          loading={loading}
          value={data}
          format={(item) => `${(item.share_pplns * 100).toFixed(3)}%`}
          color={theme.colors.green}
          title={`${t('utilizationSpace')}`}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => `${item.effort.toFixed(3)}%`}
          color={theme.colors.red}
          title={`${t('currentEffort')}`}
          settings={settings}
        />
      </View>
      <View style={styles.container}>
        <Item
          loading={loading}
          value={data}
          format={(item) => `${shortEnglishHumanizer(item.etw * 1000)}`}
          color={theme.colors.indigo}
          title={`${t('etw')}`}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => `${(item.fee * 100).toFixed(3)}%`}
          color={theme.colors.teal}
          title={`${t('effectiveFee')}`}
          settings={settings}
        />
      </View>
      <View style={styles.container}>
        <Item
          loading={loading}
          value={data}
          format={(item) => `${item.blocksTotal}`}
          color={theme.colors.orange}
          title={`${t('blocks')}`}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => item.totalTransactions}
          color={theme.colors.purple}
          title={`${t('totalRewards')}`}
          settings={settings}
        />
      </View>
      <View style={styles.container}>
        <Item
          loading={loading}
          value={data}
          format={(item) => `${item.pointsPPLNS}`}
          color={theme.colors.pink}
          title={`${t('pointsPPLNS')}`}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => item.difficulty}
          color={theme.colors.blue}
          title={`${t('difficulty')}`}
          settings={settings}
        />
      </View>
      <JoinedItem
        loading={loading}
        selected={selected}
        launcherIds={launcherIds}
        data={data}
        settings={settings}
        theme={theme}
      />
      {/* {selected ||
        (launcherIds.length === 1 && (
          <View style={styles.container}>
            <Item
              loading={dashboard.state === 'loading'}
              value={data}
              format={(item) => `${format(new Date(item.joinedLastAt[0]), 'PPpp')}`}
              color={theme.colors.green}
              title={`${'Last Joined At'}`}
              settings={settings}
            />
          </View>
        ))} */}
    </ScrollView>
  );
};

const JoinedItem = ({ selected, launcherIds, data, settings, theme, loading }) => {
  if (selected || launcherIds.length === 1)
    return (
      <View style={styles.container}>
        <Item
          loading={loading}
          value={data}
          format={(item) => `${format(new Date(item.joinedLastAt[0]), 'PPpp')}`}
          color={theme.colors.green}
          title={`${'Last Joined At'}`}
          settings={settings}
        />
      </View>
    );
  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    // alignSelf: 'stretch',
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'green',
  },
});

export default FarmerStatsScreen;
