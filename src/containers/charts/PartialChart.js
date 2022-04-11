/* eslint-disable no-plusplus */
import { addMinutes, fromUnixTime, getUnixTime, max } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, SafeAreaView, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import { selectorFamily, useRecoilState, useRecoilValueLoadable } from 'recoil';
import TestStackedBarChart from '../../charts/TestStackedBarChart';
import JellySelector from '../../components/JellySelector';
import TestLabel from '../../components/TextTest';
import { settingsState } from '../../recoil/Atoms';
import { apiMulti } from '../../services/Api';

export const { width } = Dimensions.get('window');
const keys = ['failed', 'passed'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ITEMS = [
  {
    label: '4h',
    value: 4,
  },
  {
    label: '6h',
    value: 6,
  },
  {
    label: '8h',
    value: 8,
  },
  {
    label: '12h',
    value: 12,
  },
  {
    label: '24h',
    value: 24,
  },
  {
    label: '2d',
    value: 24 * 2,
  },
  {
    label: '3d',
    value: 24 * 3,
  },
];
// export const PartChartIntervals = [
//   { time: 4, interval: 1, label: '4h' },
//   { time: 6, interval: 1, label: '6h' },
//   { time: 8, interval: 1, label: '8h' },
//   { time: 12, interval: 1, label: '12h' },
//   { time: 24, interval: 2, label: '24h' },
//   { time: 24 * 2, interval: 4, label: '2d' },
//   { time: 24 * 3, interval: 6, label: '3d' },
//   // { time: -1, value: 6, label: 'All' },
// ];

const formatDatetime = (value) => {
  'worklet';

  // we have to do it manually due to limitations of reanimated
  if (value === '') {
    return '';
  }

  const start = new Date(Number(value.start) * 1000);
  const end = new Date(Number(value.end) * 1000);
  // const end = new Date((Number(value) + interval * 3600) * 1000);
  // const end = date.setHours(date.getHours() + interval);
  const now = new Date();

  let res = `${MONTHS[start.getMonth()]} `;

  const d = start.getDate();
  if (d < 10) {
    res += '0';
  }
  res += d;

  const y = start.getFullYear();
  const yCurrent = now.getFullYear();
  if (y !== yCurrent) {
    res += `, ${y}`;
    return res;
  }

  const h = start.getHours() % 12;
  if (h === 0) {
    res += ' 12:';
  } else if (h < 10) {
    res += ` 0${h}:`;
  } else {
    res += ` ${h}:`;
  }

  const m = start.getMinutes();
  if (m < 10) {
    res += '0';
  }
  res += `${m} `;

  if (start.getHours() < 12) {
    res += 'AM';
  } else {
    res += 'PM';
  }

  res += ' - ';

  res += `${MONTHS[end.getMonth()]} `;

  const d1 = end.getDate();
  if (d1 < 10) {
    res += '0';
  }
  res += d1;

  const y1 = end.getFullYear();
  const yCurrent1 = now.getFullYear();
  if (y1 !== yCurrent1) {
    res += `, ${y1}`;
    return res;
  }

  const h1 = end.getHours() % 12;
  if (h1 === 0) {
    res += ' 12:';
  } else if (h1 < 10) {
    res += ` 0${h1}:`;
  } else {
    res += ` ${h1}:`;
  }

  const m1 = end.getMinutes();
  if (m1 < 10) {
    res += '0';
  }
  res += `${m1} `;

  if (end.getHours() < 12) {
    res += 'AM';
  } else {
    res += 'PM';
  }

  return res;
};

const query = selectorFamily({
  key: 'farmerPartials',
  get:
    (item) =>
    async ({ get }) => {
      let timestamp = new Date().getTime();
      timestamp = Math.floor(timestamp / 1000) - 60 * 60 * item.element.value;
      const urls = item.launcherIds.map(
        (launcherId) =>
          `partial/?ordering=-timestamp&min_timestamp=${timestamp.toString()}&launcher=${launcherId}&limit=2000`
      );
      const response = await apiMulti(urls);
      if (response.error) {
        throw response.error;
      }
      const intersection = (arr) => arr.reduce((a, e) => a.concat(e), []);
      const filter = (a, b) => a.concat(b);

      // console.log(response.map((farm) => farm.results).filter(filter)[0].length);
      // console.log(
      //   response
      //     .map((farm) => farm.results)
      //     .filter(filter)
      //     .reduce((a, b) => a.concat(b)).length
      // );

      const maxDate = max(
        intersection(
          response.map((farm) => farm.results.map((item) => fromUnixTime(item.timestamp)))
        )
      );
      const data = getTotalChartData(
        response.map((farm) => farm.results),
        maxDate,
        item.element.value,
        item.maxColumns
      );
      return data;
    },
});

const getTotalChartData = (response, maxDate, numHours, numBars, label) => {
  const results = [];
  const minuteGap = (numHours * 60) / numBars;
  let totalPassed = 0;
  let totalFailed = 0;
  const data = response.reduce((a, b) => a.concat(b)).sort((a, b) => b.timestamp - a.timestamp);
  let x = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
  while (x <= maxDate) x = addMinutes(x, minuteGap);
  let periodStart = addMinutes(x, -minuteGap * numBars);
  let k = data.length - 1;
  while (k >= 0 && fromUnixTime(data[k].timestamp) < periodStart) k--;
  for (let i = 0; i < numBars; i++) {
    let numSuccess = 0;
    let numFailed = 0;
    const periodEnd = addMinutes(periodStart, minuteGap);
    while (
      k >= 0 &&
      fromUnixTime(data[k].timestamp) >= periodStart &&
      fromUnixTime(data[k].timestamp) < periodEnd
    ) {
      if (!data[k].error) numSuccess++;
      else numFailed++;
      k--;
    }
    results.push({
      passed: numSuccess,
      failed: numFailed,
      time: {
        start: getUnixTime(periodStart),
        end: getUnixTime(periodEnd),
      },
    });
    totalPassed += numSuccess;
    totalFailed += numFailed;
    periodStart = periodEnd;
  }
  // });
  return { results, stats: { passed: totalPassed, failed: totalFailed, label } };
};

const Chart = ({ launcherIds, element, bottomContent, orientation, width, height }) => {
  const selectedPoints = useSharedValue(null);
  const maxColumns = orientation === 'PORTRAIT' ? 12 : 24;
  const loadableData = useRecoilValueLoadable(query({ launcherIds, element, maxColumns }));
  const theme = useTheme();
  const colors = [theme.colors.accent, theme.colors.primary];
  const { t } = useTranslation();
  const [points, setPoints] = useState([]);
  const [stats, setStats] = useState(null);
  const [graphDimensions, setGraphDimensions] = useState();

  // console.log(loadableData);

  useEffect(() => {
    if (loadableData.state === 'hasValue') {
      setPoints(loadableData.contents.results);
      setStats(loadableData.contents.stats);
    }
  }, [loadableData]);

  // console.log(selectedPartialBar)

  return (
    <View style={{ alignContent: 'center', flex: 1 }}>
      {stats && orientation === 'PORTRAIT' && (
        <>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TestLabel
                interval={1}
                defaultValue={`${element.label} ${t('overView')}`}
                format={formatDatetime}
                style={{ color: theme.colors.text, fontSize: 16, fontWeight: 'bold' }}
                selectedPoints={selectedPoints}
                type="time"
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginEnd: 16, color: theme.colors.textLight }}>
                {t('successfulPartials')}
              </Text>
              <TestLabel
                interval={1}
                defaultValue={`${stats.passed}`}
                style={{ color: theme.colors.text, fontSize: 16 }}
                selectedPoints={selectedPoints}
                type="passed"
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginEnd: 16, color: theme.colors.accent }}>
                {t('failedPartials')}
              </Text>
              <TestLabel
                interval={1}
                defaultValue={`${stats.failed}`}
                style={{ color: theme.colors.text, fontSize: 16 }}
                selectedPoints={selectedPoints}
                type="failed"
              />
            </View>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'center' }}
            onLayout={(event) => {
              const { x, y, height, width } = event.nativeEvent.layout;
              setGraphDimensions({ height, width });
            }}
          >
            {graphDimensions && (
              <>
                <View height={graphDimensions.height / 1.5}>
                  {loadableData.state === 'loading' ? (
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
                  ) : (
                    <TestStackedBarChart
                      key={orientation + element.value}
                      data={points}
                      width={width}
                      height={graphDimensions.height / 1.5}
                      keys={keys}
                      colors={colors}
                      selectedPoints={selectedPoints}
                    />
                  )}
                </View>
                <View style={{}}>{bottomContent}</View>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const PartialChart = ({ launcherIds, orientation }) => {
  const [settings, setSettings] = useRecoilState(settingsState);
  const { width, height } = Dimensions.get('window');
  const [element, setElement] = useState(ITEMS[settings.partialDefault]);

  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Chart
        height={height + 200}
        width={width}
        element={element}
        launcherIds={launcherIds}
        orientation={orientation}
        bottomContent={
          <JellySelector
            width={width}
            defaultVal={settings.partialDefault}
            items={ITEMS}
            onPress={(item, index) => {
              setElement(item);
              setSettings((prev) => ({ ...prev, partialDefault: index }));
            }}
            borderRadius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
          />
        }
      />
    </SafeAreaView>
  );
};

export default PartialChart;
