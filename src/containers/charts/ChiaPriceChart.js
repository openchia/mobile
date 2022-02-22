/* eslint-disable no-plusplus */
import { isAfter, subHours } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectorFamily, useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import JellySelector from '../../components/JellySelector';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
} from '../../react-native-animated-charts';
import { currencyState, settingsState } from '../../recoil/Atoms';
import { getCurrencyFromKey } from '../../screens/more/Currency';
import { getMarketChart } from '../../services/Api';
import { currencyFormat } from '../../utils/Formatting';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
  key: 'chiaPrice',
  get:
    (element) =>
    async ({ get }) => {
      const currency = await get(currencyState);
      const response = await getMarketChart(currency, element.value, element.interval);
      if (response.data) {
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

        return monotoneCubicInterpolation({
          data: response.data.prices.map((item) => ({
            x: item[0],
            y: item[1],
          })),
          includeExtremes: true,
          range: 100,
        });
      }
      return response.statusText;
    },
});

const Chart = ({ chiaPrice, element, bottomContent, width, height }) => {
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
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ChartPathProvider
        data={{
          points,
          smoothingStrategy: 'bezier',
        }}
      >
        <View style={{ justifyContent: 'center' }}>
          <View>
            {/* {loadableData.state === 'loading' ? (
              <View style={{ height: height / 2.5 + 60 }}>
                <ActivityIndicator
                  style={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    margin: 'auto',
                    position: 'absolute',
                  }}
                  size={60}
                  color="#119400"
                />
              </View>
            ) : (
              <> */}
            <ChartPath
              hapticsEnabled={false}
              hitSlop={30}
              smoothingWhileTransitioningEnabled={false}
              fill="none"
              height={height / 2.5}
              stroke={theme.colors.primaryLight}
              selectedStrokeWidth="1.8"
              strokeWidth="2"
              width={width}
            />
            <ChartDot
              style={{
                backgroundColor: theme.colors.accentColor,
              }}
            />
            {/* </>
            )} */}
          </View>
        </View>
        <View
          style={{
            margin: 6,
            padding: 8,
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: theme.colors.background,
            borderRadius: 4,
          }}
        >
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
      </ChartPathProvider>
      <View>{bottomContent}</View>
    </View>
  );
};

const ChiaPriceChart = ({ chiaPrice }) => {
  const [settings, setSettings] = useRecoilState(settingsState);
  const [element, setElement] = useState(ITEMS[settings.priceDefault ? settings.priceDefault : 0]);
  const { width, height } = Dimensions.get('window');
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Chart
        height={height}
        width={width}
        element={element}
        chiaPrice={chiaPrice}
        bottomContent={
          <JellySelector
            width={width}
            defaultVal={settings.priceDefault}
            items={ITEMS}
            onPress={(item, index) => {
              setElement(item);
              setSettings((prev) => ({ ...prev, priceDefault: index }));
            }}
            borderRadius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
          />
        }
      />
    </SafeAreaView>
  );
};

export default ChiaPriceChart;
