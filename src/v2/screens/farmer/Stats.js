/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shadow } from 'react-native-shadow-2';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import { farmErrorState, farmLoadingState, settingsState } from '../../../Atoms';
import CustomCard from '../../../components/CustomCard';
import { convertMojoToChia } from '../../../utils/Formatting';
import { getFarmersFromLauncherIDAndStats, getPartialsFromIDs } from '../../../Api';

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
  const settings = useRecoilValue(settingsState);

  // useEffect(() => {
  //   if (!loading.partials && data.partials) {
  //     const harvesters = new Set();
  //     const failedPartials = [];
  //     const successfulPartials = [];
  //     let partialCount = 0;
  //     let points = 0;
  //     if (selected === -1) {
  //       data.partials.forEach((farm) => {
  //         farm.data.forEach((item) => {
  //           harvesters.add(item.harvester_id);
  //           if (item.error !== null) {
  //             failedPartials.push(item);
  //           } else {
  //             successfulPartials.push(item);
  //             points += item.difficulty;
  //           }
  //           partialCount += 1;
  //         });
  //       });
  //     } else {
  //       data.partials
  //         .find((item) => item.launcherId === selected)
  //         .data.forEach((item) => {
  //           harvesters.add(item.harvester_id);
  //           if (item.error !== null) {
  //             failedPartials.push(item);
  //           } else {
  //             successfulPartials.push(item);
  //             points += item.difficulty;
  //           }
  //           partialCount += 1;
  //         });
  //     }
  //     setPartialStats({
  //       harvesters,
  //       failedPartials,
  //       successfulPartials,
  //       points,
  //       partialCount,
  //       partialPerfomance: partialPerfomance(partialCount, failedPartials.length),
  //     });
  //   }
  // }, [loading, selected]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      // contentContainerStyle={{ flexGrow: 1, marginVertical: 12, marginHorizontal: 12 }}
      contentContainerStyle={{ marginVertical: 6, marginHorizontal: 6, flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            let timestamp = new Date().getTime();
            timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
            getPartialsFromIDs(
              farms.map((item) => item.launcherId),
              timestamp
            )
              .then((partials) => {
                const harvesters = new Set();
                const failedPartials = [];
                const successfulPartials = [];
                let partialCount = 0;
                let points = 0;
                if (selected === -1) {
                  partials.forEach((farm) => {
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
                  partials
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
                setData((prev) => ({
                  ...prev,
                  partials: {
                    harvesters,
                    failedPartials,
                    successfulPartials,
                    points,
                    partialCount,
                    partialPerfomance: partialPerfomance(partialCount, failedPartials.length),
                  },
                }));
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
          value={data.partials}
          format={(item) => item.partialCount}
          color={theme.colors.green}
          title={`${t('partials')}\n(${t('24Hours').toUpperCase()})`}
          settings={settings}
          // title={`PARTIALS\n(24 HOURS)`}
        />
        {/* <View style={{ width: 16 }} /> */}
        <Item
          loading={loading.partials}
          value={data.partials}
          format={(item) => item.points}
          color={theme.colors.blue}
          title={`${t('points')}\n(${t('24Hours').toUpperCase()})`}
          settings={settings}
        />
      </View>
      <View style={styles.container}>
        <Item
          loading={loading.partials}
          value={data.partials}
          format={(item) => item.successfulPartials.length}
          color={theme.colors.indigo}
          title={`${t('successfulPartials')}`}
          settings={settings}
        />
        <Item
          loading={loading.partials}
          value={data.partials}
          format={(item) => item.failedPartials.length}
          color={theme.colors.orange}
          title={`${t('failedPartials')}`}
          settings={settings}
        />
      </View>
      <View style={styles.container}>
        <Item
          loading={loading.partials}
          value={data.partials}
          format={(item) => `${item.partialPerfomance.toFixed(1)}%`}
          color={theme.colors.pink}
          title={t('partialPerfomance')}
          settings={settings}
        />
        <Item
          loading={loading.partials}
          value={data.partials}
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
