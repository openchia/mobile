/* eslint-disable no-plusplus */
import { getUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, SafeAreaView, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilState, useRecoilValueLoadable } from 'recoil';
import { getSpace } from '../Api';
import { settingsState } from '../Atoms';
import JellySelector from '../components/JellySelector';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
} from '../react-native-animated-charts';

export const { width } = Dimensions.get('window');
const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ITEMS = [
  {
    label: '24h',
    value: 1,
  },
  {
    label: '3d',
    value: 3,
  },
  {
    label: '7d',
    value: 7,
  },
  {
    label: '30d',
    value: 30,
  },
  {
    label: '90d',
    value: 90,
  },
  {
    label: '1y',
    value: 365,
  },
];

export const formatY = (value) => {
  'worklet';

  if (value === '') {
    return '';
  }
  let bytes = Number(value);
  const thresh = 1024;
  if (bytes < thresh) return `${bytes} B`;
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh);
  return `${bytes.toFixed(2)} ${units[u]}`;
};

const formatDatetime = (value) => {
  'worklet';

  // we have to do it manually due to limitations of reanimated
  if (value === '') {
    return '';
  }

  const date = new Date(Number(value) * 1000);
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
  key: 'poolSpace',
  get:
    (element) =>
    async ({ get }) => {
      const response = await getSpace(element.value);
      if (response) {
        const convertedData = response.map((item) => ({
          x: getUnixTime(new Date(item.date)),
          y: item.size,
        }));

        return monotoneCubicInterpolation({
          data: convertedData,
          includeExtremes: true,
          range: 100,
        });
      }
      return response.statusText;
    },
});

const Chart = ({ poolSpace, element, bottomContent }) => {
  const loadableData = useRecoilValueLoadable(query(element));
  const [points, setPoints] = useState([]);
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (loadableData.state === 'hasValue') {
      setPoints(loadableData.contents);
    }
  }, [loadableData]);

  return (
    <View style={{ flex: 1 }}>
      <ChartPathProvider data={{ points, smoothingStrategy: 'bezier' }}>
        <View style={{ marginTop: 16, marginLeft: 16, alignSelf: 'auto' }}>
          <ChartXLabel
            format={formatDatetime}
            defaultValue={t('poolSpace')}
            style={{ color: theme.colors.text, padding: 0, fontSize: 16 }}
          />
          <ChartYLabel
            format={formatY}
            defaultValue={poolSpace}
            style={{ color: theme.colors.text, padding: 0, fontSize: 24 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View>
            {points.length === 0 && (
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
            )}
            <ChartPath
              hapticsEnabled={false}
              hitSlop={30}
              smoothingWhileTransitioningEnabled={false}
              fill="none"
              height={width / 2}
              stroke={theme.colors.primaryLight}
              backgroundColor="url(#prefix__paint0_linear)"
              selectedStrokeWidth="1.8"
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
    </View>
  );
};

const PoolspaceChart = ({ poolSpace }) => {
  const [settings, setSettings] = useRecoilState(settingsState);
  const [element, setElement] = useState(
    ITEMS[settings.poolspaceDefault ? settings.poolspaceDefault : 4]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Chart
        element={element}
        poolSpace={poolSpace}
        bottomContent={
          <JellySelector
            defaultVal={settings.priceDefault}
            items={ITEMS}
            onPress={(item, index) => {
              setElement(item);
              setSettings((prev) => ({ ...prev, priceDefault: index }));
            }}
          />
        }
      />
    </SafeAreaView>
  );
};

export default PoolspaceChart;
