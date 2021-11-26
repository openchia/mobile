/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import CustomCard from '../components/CustomCard';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
} from '../react-native-animated-charts';
import { NetspaceChartIntervals } from './Constants';

export const { width } = Dimensions.get('window');

const SELECTION_WIDTH = width - 32;
const BUTTON_WIDTH = (width - 32) / NetspaceChartIntervals.length;
const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

const PoolspaceChart = ({ data, maxSize }) => {
  const transition = useSharedValue(0);
  const previous = useSharedValue(0);
  const current = useSharedValue(0);
  const [points, setPoints] = useState(data[current.value]);
  const theme = useTheme();
  const { t } = useTranslation();

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(BUTTON_WIDTH * current.value) }],
  }));

  return (
    <View style={styles.container}>
      <ChartPathProvider data={{ points, smoothingStrategy: 'bezier' }}>
        <View style={{ marginTop: 16, marginLeft: 16, alignSelf: 'auto' }}>
          {/* <Text>Hello</Text> */}
          <ChartXLabel
            format={formatDatetime}
            defaultValue={t('poolSpace')}
            style={{ color: theme.colors.text, padding: 0, fontSize: 16 }}
          />
          <ChartYLabel
            format={formatY}
            defaultValue={maxSize}
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
              backgroundColor="url(#prefix__paint0_linear)"
              strokeWidth="2"
              width={width}
            />
            <ChartDot
              style={{
                backgroundColor: theme.colors.accentColor,
              }}
            />
          </View>
          <CustomCard style={{ marginTop: 16 }}>
            <View style={styles.selection}>
              <View
                style={[StyleSheet.absoluteFill, { marginTop: 4, marginBottom: 4, marginStart: 4 }]}
              >
                <Animated.View
                  style={[
                    styles.backgroundSelection,
                    { backgroundColor: theme.colors.accent },
                    style,
                  ]}
                />
              </View>
              {NetspaceChartIntervals.map((item, index) => (
                <TouchableWithoutFeedback
                  key={item.label}
                  onPress={() => {
                    previous.value = current.value;
                    transition.value = 0;
                    current.value = index;
                    transition.value = withTiming(1);
                    setPoints(data[index]);
                  }}
                  style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                >
                  <Animated.View style={[styles.labelContainer]}>
                    <Text
                      // adjustsFontSizeToFit
                      style={[styles.label, { color: theme.colors.jellyBarText }]}
                    >
                      {t(`${item.label}`)}
                    </Text>
                  </Animated.View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </CustomCard>
        </View>
      </ChartPathProvider>
    </View>
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

export default PoolspaceChart;
