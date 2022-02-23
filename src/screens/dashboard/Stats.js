/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import { useRecoilValue } from 'recoil';
import { apiMultiGet } from '../../services/Api';
import { settingsState } from '../../recoil/Atoms';
import CustomCard from '../../components/CustomCard';

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

const FarmerStatsScreen = ({ launcherIds, selected }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useRecoilValue(settingsState);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefresh] = useState(false);

  const handleError = useErrorHandler();

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    let timestamp = new Date().getTime();
    timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
    const calls = launcherIds.map(
      (launcherId) =>
        `partial/?ordering=-timestamp&min_timestamp=${timestamp.toString()}&launcher=${launcherId}&limit=2000`
    );

    const fetchData = async () => {
      const response = await apiMultiGet(calls, {
        signal: controller.signal,
      }).catch((err) => {
        handleError(err);
      });

      if (response) {
        const harvesters = new Set();
        const failedPartials = [];
        const successfulPartials = [];
        let partialCount = 0;
        let points = 0;

        // console.log(response.map((item) => item.results));

        response
          .map((data) => data.results)
          .forEach((farm) => {
            farm.forEach((item) => {
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

        setData({
          harvesters,
          failedPartials,
          successfulPartials,
          points,
          partialCount,
          partialPerfomance: partialPerfomance(partialCount, failedPartials.length),
        });
      }
      setLoading(false);
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [refreshing, selected]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      // contentContainerStyle={{ flexGrow: 1, marginVertical: 12, marginHorizontal: 12 }}
      contentContainerStyle={{ marginVertical: 6, marginHorizontal: 6, flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            setLoading(true);
            setRefresh((prev) => !prev);
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
          loading={loading}
          value={data}
          format={(item) => item.partialCount}
          color={theme.colors.green}
          title={`${t('partials')}\n(${t('24Hours').toUpperCase()})`}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => item.points}
          color={theme.colors.blue}
          title={`${t('points')}\n(${t('24Hours').toUpperCase()})`}
          settings={settings}
        />
      </View>
      <View style={styles.container}>
        <Item
          loading={loading}
          value={data}
          format={(item) => item.successfulPartials.length}
          color={theme.colors.indigo}
          title={`${t('successfulPartials')}`}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => item.failedPartials.length}
          color={theme.colors.orange}
          title={`${t('failedPartials')}`}
          settings={settings}
        />
      </View>
      <View style={styles.container}>
        <Item
          loading={loading}
          value={data}
          format={(item) => `${item.partialPerfomance.toFixed(1)}%`}
          color={theme.colors.pink}
          title={t('partialPerfomance')}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => item.harvesters.size}
          color={theme.colors.purple}
          title={t('harvesterCount')}
          settings={settings}
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
          value={data.partials}
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
