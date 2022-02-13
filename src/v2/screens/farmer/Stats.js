/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shadow } from 'react-native-shadow-2';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { farmErrorState, farmLoadingState } from '../../../Atoms';
import CustomCard from '../../../components/CustomCard';
import { convertMojoToChia } from '../../../utils/Formatting';
import { getFarmersFromLauncherIDAndStats, getPartialsFromIDs } from '../../../Api';

const Item = ({ title, color, loading, value, format }) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, margin: 8 }}>
      <Shadow
        distance={6}
        startColor="rgba(0, 0, 0, 0.02)"
        finalColor="rgba(0, 0, 0, 0.0)"
        radius={24}
        viewStyle={{ height: '100%', width: '100%' }}
      >
        <CustomCard
          style={{
            borderRadius: 24,
            backgroundColor: theme.colors.onSurfaceLight,
            flex: 1,
            // alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text numberOfLines={1} style={{ color, fontSize: 14, textAlign: 'center' }}>
            {title}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            {!loading && value ? format(value) : '...'}
          </Text>
        </CustomCard>
      </Shadow>
    </View>
  );
};

const partialPerfomance = (partialCount, failedPartialCount) =>
  ((partialCount - failedPartialCount) * 100) / partialCount;

const FarmerStatsScreen = ({
  data,
  loading,
  error,
  selected = -1,
  farms,
  setData,
  setLoading,
  setError,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [partialStats, setPartialStats] = useState(null);

  useEffect(() => {
    if (!loading.partials && data.partials) {
      const harvesters = new Set();
      const failedPartials = [];
      const successfulPartials = [];
      let partialCount = 0;
      let points = 0;
      if (selected === -1) {
        data.partials.forEach((farm) => {
          farm.data.forEach((item) => {
            harvesters.add(item.harvester_id);
            if (item.error !== null) {
              failedPartials.push(item);
            } else {
              successfulPartials.push(item);
              points += item.difficulty;
            }
            partialCount += 1;
          });
        });
      } else {
        data.partials
          .find((item) => item.launcherId === selected)
          .data.forEach((item) => {
            harvesters.add(item.harvester_id);
            if (item.error !== null) {
              failedPartials.push(item);
            } else {
              successfulPartials.push(item);
              points += item.difficulty;
            }
            partialCount += 1;
          });
      }
      setPartialStats({
        harvesters,
        failedPartials,
        successfulPartials,
        points,
        partialCount,
        partialPerfomance: partialPerfomance(partialCount, failedPartials.length),
      });
    }
  }, [loading, selected]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, marginVertical: 12, marginHorizontal: 12 }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            let timestamp = new Date().getTime();
            timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
            setLoading((prev) => ({ ...prev, partials: true }));
            getPartialsFromIDs(
              farms.map((item) => item.launcherId),
              timestamp
            )
              .then((partials) => {
                setData((prev) => ({ ...prev, partials }));
              })
              .catch((error) => {
                setError((prev) => ({ ...prev, partials: true }));
              })
              .finally(() => {
                setLoading((prev) => ({ ...prev, partials: false }));
              });
          }}
        />
      }
    >
      {/* <HeaderItem
        loadable={dataLoadable}
        launcherId={launcherId}
        currency={currency}
        t={t}
        theme={theme}
      /> */}
      {/* <View style={{ height: 8 }} /> */}
      <View style={styles.container}>
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.partialCount}
          color={theme.colors.green}
          title={`${t('partials')}\n(${t('24Hours').toUpperCase()})`}
          // title={`PARTIALS\n(24 HOURS)`}
        />
        {/* <View style={{ width: 16 }} /> */}
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.points}
          color={theme.colors.blue}
          title={`${t('points')}\n(${t('24Hours').toUpperCase()})`}
        />
      </View>
      {/* <View style={{ width: 16 }} /> */}
      <View style={styles.container}>
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.successfulPartials.length}
          color={theme.colors.indigo}
          title={`${t('successfulPartials')}`}
        />
        {/* <View style={{ width: 16 }} /> */}
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.failedPartials.length}
          color={theme.colors.orange}
          title={`${t('failedPartials')}`}
        />
      </View>
      {/* <View style={{ width: 16 }} /> */}
      <View style={styles.container}>
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => `${item.partialPerfomance.toFixed(1)}%`}
          color={theme.colors.pink}
          title={t('partialPerfomance')}
        />
        {/* <View style={{ width: 16 }} /> */}
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.harvesters.size}
          color={theme.colors.purple}
          title={t('harvesterCount')}
        />
      </View>
      {/* <View style={{ height: 8 }} /> */}
      {/* <View style={styles.container}>
        <Item
          value={payouts}
          format={(item) => `${convertMojoToChia(item)} XCH`}
          color={theme.colors.pink}
          title={t('partialPerfomance')}
        />
        <View style={{ width: 8 }} />
        <Item
          value={partialStats}
          format={(item) => item.harvesters.size}
          color={theme.colors.purple}
          title={t('harvesterCount')}
        />
      </View> */}
      {/* <View style={{ height: 8 }} /> */}
    </ScrollView>
  );
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
