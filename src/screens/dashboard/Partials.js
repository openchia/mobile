/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import { useRecoilValue, useRecoilRefresher_UNSTABLE as useRecoilRefresher } from 'recoil';
import { apiMulti } from '../../services/Api';
import { dashboardState, settingsState } from '../../recoil/Atoms';
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

const PartialsScreen = ({ launcherIds, selected, farmData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useRecoilValue(settingsState);
  const [data, setData] = useState();
  const [refreshing, setRefresh] = useState(false);
  const refreshDashboard = useRecoilRefresher(dashboardState);

  const handleError = useErrorHandler();

  useEffect(() => {
    if (!loading) {
      let mTotal = 0;
      let mPoints = 0;
      let mSuccessful = 0;
      let mFailed = 0;
      let mPerformance = 0;
      let mHarvesters = 0;

      // const { farms } = farmData.contents;
      // const { length } = farms;

      farmData.forEach((farm) => {
        const { total, points, successful, failed, performance, harvesters } = farm.partials;
        mTotal += total;
        mPoints += points;
        mSuccessful += successful;
        mFailed += failed;
        mPerformance += performance;
        mHarvesters += harvesters;
      });

      setData({
        total: mTotal,
        points: mPoints,
        successful: mSuccessful,
        failed: mFailed,
        performance: mPerformance / farmData.length,
        harvesters: mHarvesters,
      });
    }
  }, [farmData, selected]);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   setLoading(true);

  //   const urls = launcherIds.map((launcherId) => `launcher/${launcherId}`);

  //   const fetchData = async () => {
  //     const response = await apiMulti(urls, controller.signal).catch((err) => {
  //       handleError(err);
  //     });

  //     if (response) {
  //       let mTotal = 0;
  //       let mPoints = 0;
  //       let mSuccessful = 0;
  //       let mFailed = 0;
  //       let mPerformance = 0;
  //       let mHarvesters = 0;

  //       // // console.log(response.map((item) => item.results));

  //       response.forEach((farm) => {
  //         const { total, points, successful, failed, performance, harvesters } = farm.partials;
  //         mTotal += total;
  //         mPoints += points;
  //         mSuccessful += successful;
  //         mFailed += failed;
  //         mPerformance += performance;
  //         mHarvesters += harvesters;
  //       });

  //       // response
  //       //   .map((data) => data.results)
  //       //   .forEach((farm) => {
  //       //     farm.forEach((item) => {
  //       //       harvesters.add(item.harvester_id);
  //       //       if (item.error !== null) {
  //       //         failedPartials.push(item);
  //       //       } else {
  //       //         successfulPartials.push(item);
  //       //         points += item.difficulty;
  //       //       }
  //       //       partialCount += 1;
  //       //     });
  //       //   });

  //       setData({
  //         total: mTotal,
  //         points: mPoints,
  //         successful: mSuccessful,
  //         failed: mFailed,
  //         performance: mPerformance / response.length,
  //         harvesters: mHarvesters,
  //       });
  //     }
  //     setLoading(false);
  //   };
  //   fetchData();

  //   return () => {
  //     controller.abort();
  //   };
  // }, [refreshing, selected]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      // contentContainerStyle={{ flexGrow: 1, marginVertical: 12, marginHorizontal: 12 }}
      contentContainerStyle={{ paddingTop: 6, paddingBottom: 6, marginHorizontal: 6, flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            refreshDashboard();
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
          format={(item) => item.total}
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
          format={(item) => item.successful}
          color={theme.colors.indigo}
          title={`${t('successfulPartials')}`}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => item.failed}
          color={theme.colors.orange}
          title={`${t('failedPartials')}`}
          settings={settings}
        />
      </View>
      <View style={styles.container}>
        <Item
          loading={loading}
          value={data}
          format={(item) => `${item.performance.toFixed(1)}%`}
          color={theme.colors.pink}
          title={t('partialPerfomance')}
          settings={settings}
        />
        <Item
          loading={loading}
          value={data}
          format={(item) => item.harvesters}
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

export default PartialsScreen;
