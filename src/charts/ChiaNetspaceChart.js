/* eslint-disable no-plusplus */
import { getUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, SafeAreaView, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilState, useRecoilValueLoadable } from 'recoil';
import { getNetspace, getSpace } from '../Api';
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

const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ITEMS = [
  {
    label: '24h',
    value: '24hr',
  },
  // {
  //   label: '3d',
  //   value: '3d',
  // },
  {
    label: '7d',
    value: '1w',
  },
  {
    label: '30d',
    value: '1m',
  },
  // {
  //   label: '90d',
  //   value: 90,
  // },
  {
    label: '1y',
    value: '1y',
  },
];

export const formatY = (value) => {
  'worklet';

  if (value === '') {
    return '';
  }
  const number = Number(value);
  // const thresh = 1024;
  // if (bytes < thresh) return `${bytes} B`;
  // let u = -1;
  // do {
  //   bytes /= thresh;
  //   ++u;
  // } while (bytes >= thresh);
  return `${number.toFixed(2)} EiB`;
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
  key: 'netspace',
  get:
    (element) =>
    async ({ get }) => {
      console.log(element.value);
      const response = await getNetspace(element.value);
      if (response) {
        const convertedData = [];

        response.netspace.forEach((item, index) => {
          convertedData.push({ x: response.timestamp[index] / 1000, y: item });
        });

        console.log(convertedData);

        return monotoneCubicInterpolation({
          data: convertedData,
          includeExtremes: true,
          range: 100,
        });
      }
      return response.statusText;
    },
});

const Chart = ({ netspace, element, bottomContent, width, height }) => {
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
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ChartPathProvider data={{ points, smoothingStrategy: 'bezier' }}>
        <View style={{ justifyContent: 'center' }}>
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
              height={height / 2.5}
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
            defaultValue={t('netspace')}
            style={{ color: theme.colors.text, padding: 0, fontSize: 16 }}
          />
          <ChartYLabel
            format={formatY}
            defaultValue={netspace}
            style={{ color: theme.colors.text, padding: 0, fontSize: 24 }}
          />
        </View>
      </ChartPathProvider>
      <View>{bottomContent}</View>
    </View>
  );
};

const NetspaceChart = ({ netspace }) => {
  const [settings, setSettings] = useRecoilState(settingsState);
  const [element, setElement] = useState(
    ITEMS[settings.netspaceDefault ? settings.netspaceDefault : 2]
  );
  const { width, height } = Dimensions.get('window');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Chart
        height={height}
        width={width}
        element={element}
        netspace={netspace}
        bottomContent={
          <JellySelector
            width={width}
            defaultVal={settings.netspaceDefault}
            items={ITEMS}
            onPress={(item, index) => {
              setElement(item);
              setSettings((prev) => ({ ...prev, netspaceDefault: index }));
            }}
          />
        }
      />
    </SafeAreaView>
  );
};

export default NetspaceChart;
