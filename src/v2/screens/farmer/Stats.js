/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropShadow from 'react-native-drop-shadow';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { farmErrorState, farmLoadingState, farmState } from '../../../Atoms';
import CustomCard from '../../../components/CustomCard';
import { convertMojoToChia } from '../../../utils/Formatting';

const Item = ({ title, color, loading, value, format }) => {
  const theme = useTheme();
  return (
    <DropShadow
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.05,
        // shadowOpacity: 1,
        shadowRadius: 3,
        flex: 1,
        marginVertical: 8,
      }}
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
        {/* <Text>Hello</Text> */}
        {/* <View style={styles.item}> */}
        <Text numberOfLines={1} style={{ color, fontSize: 14, textAlign: 'center' }}>
          {title}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            // marginTop: 10,
            // marginBottom: 10,
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          {!loading && value ? format(value) : '...'}
        </Text>
        {/* </View> */}
      </CustomCard>
    </DropShadow>
  );
};

const partialPerfomance = (partialCount, failedPartialCount) =>
  ((partialCount - failedPartialCount) * 100) / partialCount;

const FarmerStatsScreen = ({ data, loading, error, selected = -1 }) => {
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
      contentContainerStyle={{ flexGrow: 1, marginVertical: 16, marginHorizontal: 16 }}
      refreshControl={<RefreshControl refreshing={false} />}
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
        <View style={{ width: 16 }} />
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.points}
          color={theme.colors.blue}
          title={`${t('points')}\n(${t('24Hours').toUpperCase()})`}
        />
      </View>
      <View style={{ width: 16 }} />
      <View style={styles.container}>
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.successfulPartials.length}
          color={theme.colors.indigo}
          title={`${t('successfulPartials')}`}
        />
        <View style={{ width: 16 }} />
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.failedPartials.length}
          color={theme.colors.orange}
          title={`${t('failedPartials')}`}
        />
      </View>
      <View style={{ width: 16 }} />
      <View style={styles.container}>
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => `${item.partialPerfomance.toFixed(1)}%`}
          color={theme.colors.pink}
          title={t('partialPerfomance')}
        />
        <View style={{ width: 16 }} />
        <Item
          loading={loading.partials}
          value={partialStats}
          format={(item) => item.harvesters.size}
          color={theme.colors.purple}
          title={t('harvesterCount')}
        />
      </View>
      <View style={{ height: 8 }} />
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
  },
  item: {
    // flex: 1,
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FarmerStatsScreen;
