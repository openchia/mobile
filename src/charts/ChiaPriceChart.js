/* eslint-disable no-plusplus */
import React, { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { selectorFamily, useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fromUnixTime, isAfter, subHours } from 'date-fns';
import CustomCard from '../components/CustomCard';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  simplifyData,
} from '../react-native-animated-charts';
import { NetspaceChartIntervals } from './Constants';
import { getMarketChart } from '../Api';
import JellySelector from '../components/JellySelector';
import { currencyState } from '../Atoms';
import LoadingComponent from '../components/LoadingComponent';
import { currencyFormat } from '../utils/Formatting';
import { getCurrencyFromKey } from '../screens/CurrencySelectionScreen';

export const { width } = Dimensions.get('window');

const SELECTION_WIDTH = width - 32;
const BUTTON_WIDTH = (width - 32) / NetspaceChartIntervals.length;
const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatY = (value, extraVal) => {
  'worklet';

  if (value === '') {
    return '';
  }
  const fiatVal = Number(value);
  return `${fiatVal.toFixed(2)} ${extraVal}`;
};

const formatDatetime = (value) => {
  'worklet';

  // we have to do it manually due to limitations of reanimated
  if (value === '') {
    return '';
  }

  const date = new Date(Number(value));
  const now = new Date();

  let res = `${MONTHS[date.getMonth()]} `;

  const d = date.getDate();
  if (d < 10) {
    res += '0';
  }
  res += d;

  const y = date.getFullYear();
  const yCurrent = now.getFullYear();
  if (y !== yCurrent) {
    res += `, ${y}`;
    return res;
  }

  const h = date.getHours() % 12;
  if (h === 0) {
    res += ' 12:';
  } else if (h < 10) {
    res += ` 0${h}:`;
  } else {
    res += ` ${h}:`;
  }

  const m = date.getMinutes();
  if (m < 10) {
    res += '0';
  }
  res += `${m} `;

  if (date.getHours() < 12) {
    res += 'AM';
  } else {
    res += 'PM';
  }

  return res;
};

const query = selectorFamily({
  key: 'farmer',
  get:
    (element) =>
    async ({ get }) => {
      // get(farmerRefreshState());
      const currency = await get(currencyState);
      const response = await getMarketChart(currency, element.value, element.interval);
      if (response.data) {
        if (element.label === '90d' || element.label === '30d') {
          return simplifyData(
            response.data.prices.map((item) => ({
              x: item[0],
              y: item[1],
            })),
            10,
            true
          );
        }
        if (element.label === '1h') {
          let now = Date.now();
          now = subHours(now, 1);
          const data = response.data.prices
            .filter((item) => isAfter(new Date(item[0]), now))
            .map((item) => ({
              x: item[0],
              y: item[1],
            }));
          return data;
        }
        return simplifyData(
          response.data.prices.map((item) => ({
            x: item[0],
            y: item[1],
          })),
          4,
          true
        );
        // return response.data.prices.map((item) => ({
        //   x: item[0],
        //   y: item[1],
        // }));
      }
      return response.statusText;
    },
});

const Chart = ({ data, chiaPrice, element, bottomContent }) => {
  const loadableData = useRecoilValueLoadable(query(element));
  const currency = useRecoilValue(currencyState);
  const theme = useTheme();
  const [points, setPoints] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (loadableData.state === 'hasValue') {
      setPoints(loadableData.contents);
    }
  }, [loadableData]);
  return (
    <>
      <ChartPathProvider
        data={{
          points,
          smoothingStrategy: 'bezier',
        }}
      >
        <View style={{ marginTop: 16, marginLeft: 16, alignSelf: 'auto' }}>
          <ChartXLabel
            format={formatDatetime}
            defaultValue={t('chiaPrice')}
            style={{ color: theme.colors.text, padding: 0, fontSize: 16 }}
          />
          <ChartYLabel
            format={formatY}
            extraVal={`${getCurrencyFromKey(currency)}`}
            defaultValue={`${currencyFormat(chiaPrice)} ${getCurrencyFromKey(currency)}`}
            style={{ color: theme.colors.text, padding: 0, fontSize: 24 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{}}>
            <ChartPath
              hapticsEnabled={false}
              hitSlop={30}
              smoothingWhileTransitioningEnabled={false}
              fill="none"
              height={width / 2}
              stroke={theme.colors.primaryLight}
              // backgroundColor="url(#prefix__paint0_linear)"
              strokeWidth="2"
              width={width}
            />
            <ChartDot
              style={{
                backgroundColor: theme.colors.accentColor,
              }}
            />
            {bottomContent}
          </View>
        </View>
      </ChartPathProvider>
    </>
  );
};

const ITEMS = [
  {
    label: '1h',
    value: 1,
    interval: 1,
  },
  {
    label: '24h',
    value: 1,
    interval: 1,
  },
  {
    label: '7d',
    value: 7,
    interval: 1,
  },
  {
    label: '30d',
    value: 30,
    interval: 1,
  },
  {
    label: '90d',
    value: 90,
    interval: 1,
  },
  {
    label: '1y',
    value: 365,
    interval: 1,
  },
  {
    label: 'all',
    value: 'max',
    interval: 1,
  },
];

const ChiaPriceChart = ({ chiaPrice }) => {
  const [element, setElement] = useState(ITEMS[0]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Chart
        element={element}
        chiaPrice={chiaPrice}
        bottomContent={
          <JellySelector
            items={ITEMS}
            onPress={(item) => {
              setElement(item);
            }}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // backgroundColor: 'white',
  },
  backgroundSelection: {
    backgroundColor: '#f3f3f3',
    ...StyleSheet.absoluteFillObject,
    width: BUTTON_WIDTH - 6,
    borderRadius: 8,
  },
  selection: {
    display: 'flex',
    // marginTop: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: SELECTION_WIDTH,
    alignSelf: 'center',
  },
  labelContainer: {
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
    width: BUTTON_WIDTH,
  },
  label: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default ChiaPriceChart;
