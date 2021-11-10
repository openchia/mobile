/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { data1, data2 } from './data';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
} from '../../react-native-animated-charts';

export const { width: SIZE } = Dimensions.get('window');

const ChartContainer = styled.View`
  margin-vertical: 17px;
`;

const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

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
  return `${bytes.toFixed(1)} ${units[u]}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDatetime(value) {
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
}

const GenericExample = ({ points }) => (
  <ChartPathProvider data={{ points, smoothingStrategy: 'bezier' }}>
    <ChartYLabel format={formatY} style={{ color: 'green', margin: 4 }} />
    <ChartXLabel format={formatDatetime} style={{ color: 'red', margin: 4 }} />
    <ChartContainer>
      <ChartPath
        hapticsEnabled={false}
        hitSlop={30}
        smoothingWhileTransitioningEnabled={false}
        fill="none"
        height={SIZE / 2}
        stroke="green"
        strokeWidth="2"
        width={SIZE}
      />
      <ChartDot
        style={{
          backgroundColor: 'green',
        }}
      />
    </ChartContainer>
  </ChartPathProvider>
);
export default GenericExample;
