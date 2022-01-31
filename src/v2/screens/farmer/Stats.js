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

const Item = ({ title, color, value, format }) => {
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
        // marginVertical: 16,
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
          {value ? format(value) : '...'}
        </Text>
        {/* </View> */}
      </CustomCard>
    </DropShadow>
  );
};

const partialPerfomance = (partialCount, failedPartialCount) =>
  ((partialCount - failedPartialCount) * 100) / partialCount;

const FarmerStatsScreen = ({ launcherId, dataLoadable, route, navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [data, setData] = useRecoilState(farmState);
  const [loading, setLoading] = useRecoilState(farmLoadingState);
  const [error, setError] = useRecoilState(farmErrorState);
  const [partialStats, setPartialStats] = useState(null);
  const [payouts, setPayouts] = useState();

  useEffect(() => {
    if (data.partials) {
      const harvesters = new Set();
      const failedPartials = [];
      const successfulPartials = [];
      let partialCount = 0;
      let points = 0;
      data.partials.forEach((farm) => {
        farm.results.forEach((item) => {
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
      setPartialStats({
        harvesters,
        failedPartials,
        successfulPartials,
        points,
        partialCount,
        partialPerfomance: partialPerfomance(partialCount, failedPartials.length),
      });
    }
    if (data.payouts) {
      console.log(data.payouts[0].results.map((item) => item.amount).length);
      // console.log(
      //   convertMojoToChia(
      //     data.payouts
      //       .map((item) =>
      //         item.results.map((item) => item.amount).reduce((prev, next) => prev + next)
      //       )

      //       .reduce((prev, next) => prev + next)
      //   )
      // );

      // .map((item) => item.amount)
      // .reduce((prev, next) => prev + next)

      // setPayouts(data.payouts.map((item) => item.amount).reduce((prev, next) => prev + next));
    }
  }, [data]);

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
          // partialStats={partialStats}
          value={partialStats}
          format={(item) => item.partialCount}
          color={theme.colors.green}
          title={`${t('partials')}\n(${t('24Hours').toUpperCase()})`}
          // title={`PARTIALS\n(24 HOURS)`}
        />
        <View style={{ width: 8 }} />
        <Item
          // partialStats={partialStats}
          value={partialStats}
          format={(item) => item.points}
          color={theme.colors.blue}
          title={`${t('points')}\n(${t('24Hours').toUpperCase()})`}
        />
      </View>
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <Item
          value={partialStats}
          format={(item) => item.successfulPartials.length}
          color={theme.colors.indigo}
          title={`${t('successfulPartials')}`}
        />
        <View style={{ width: 8 }} />
        <Item
          value={partialStats}
          format={(item) => item.failedPartials.length}
          color={theme.colors.orange}
          title={`${t('failedPartials')}`}
        />
      </View>
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <Item
          value={partialStats}
          format={(item) => `${item.partialPerfomance.toFixed(1)}%`}
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
    marginVertical: 4,
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
