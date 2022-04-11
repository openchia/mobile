/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import { useRecoilValue } from 'recoil';
import { api, apiMulti } from '../../services/Api';
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

const FeeScreen = ({ launcherId }) => {
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

    const fetchData = async () => {
      const response = await api(`launcher/${launcherId}`, controller.signal).catch((err) => {
        handleError(err);
      });

      if (response) {
        const {
          stay_length_days,
          stay_length_days_max,
          stay_length_discount,
          stay_length_discount_max,
          size_discount,
          max_discount,
          pool,
          final,
        } = response.fee;

        setData({
          stayLengthDays: stay_length_days,
          stayLengthDaysMax: stay_length_days_max,
          stayLengthDiscount: stay_length_discount,
          stayLengthDiscountMax: stay_length_discount_max,
          sizeDiscount: size_discount,
          maxDiscount: max_discount,
          pool,
          final,
        });
      }
      setLoading(false);
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [refreshing]);

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

export default FeeScreen;
