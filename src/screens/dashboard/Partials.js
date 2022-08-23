/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilRefresher_UNSTABLE as useRecoilRefresher, useRecoilValue } from 'recoil';
import PressableCard from '../../components/PressableCard';
import { dashboardState, settingsState } from '../../recoil/Atoms';

const Item = ({
  title,
  color,
  loading,
  value,
  format,
  settings,
  icon,
  enabled = false,
  onPress,
}) => {
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
        <PressableCard
          enabled={enabled}
          onPress={onPress}
          style={{
            borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
            backgroundColor: theme.colors.onSurfaceLight,
            flex: 1,
            // alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={styles.item}>
            <Text numberOfLines={1} style={{ color, fontSize: 14, textAlign: 'center' }}>
              {title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                textAlign: 'center',
              }}
            >
              {!loading && value ? format(value) : '...'}
            </Text>
            <View
              style={{
                position: 'absolute',
                right: 4,
                bottom: 4,
              }}
            >
              {icon}
            </View>
          </View>
        </PressableCard>
      </Shadow>
    </View>
  );
};

const PartialsScreen = ({ launcherIds, selected, farmData, loading }) => {
  const navigation = useNavigation();
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
      <View style={styles.container}>
        <Item
          enabled
          loading={loading}
          value={data}
          format={(item) => item.total}
          color={theme.colors.green}
          title={`${t('partials')}\n(${t('24h').toUpperCase()})`}
          settings={settings}
          // icon={
          //   <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
          // }
          // onPress={() => {
          //   navigation.navigate({
          //     name: 'Farmer Partials Chart',
          //     params: {
          //       launcherIds,
          //     },
          //   });
          // }}
        />
        <Item
          // enabled
          loading={loading}
          value={data}
          format={(item) => item.points}
          color={theme.colors.blue}
          title={`${t('points')}\n(${t('24h').toUpperCase()})`}
          settings={settings}
          // onPress={() => {
          //   navigation.navigate({
          //     name: 'SkiaTest',
          //   });
          // }}
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
          title={t('partialPerformance')}
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
  item: {
    height: '100%',
    justifyContent: 'center',
  },
});

export default PartialsScreen;
