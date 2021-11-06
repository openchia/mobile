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
  bSplineInterpolation,
  simplifyData,
} from '../../react-native-animated-charts';
import Labels from '../ExtremeLabels';

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

const GenericExample = ({ dataSet }) => {
  // console.log(dataSet.map((item) => ({ x: item.date, y: item.size })));
  const data1 = dataSet.map((item) => ({ x: getUnixTime(new Date(item.date)), y: item.size }));
  console.log(data1[0]);

  const [smoothingWhileTransitioningEnabled, setSmoothingWhileTransitioningEnabled] =
    useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(false);
  const [data, setData] = useState({ points: data1 });
  const [dataSource, setDataSource] = useState(1);
  const [simplifying, setSimplifying] = useState(false);
  const [pickRange, setPickRange] = useState(10);
  const [includeExtremes, setIncludeExtremes] = useState(true);
  const [interpolationStrategy, setInterpolationStrategy] = useState('b');
  const [numberOfPointsInterpolated, setNumberOfPointsInterpolated] = useState(80);
  const [bSplineDegree, setBSplineDegree] = useState(3);
  const [smoothingStrategy, setSmoothingStrategy] = useState('none');
  const [smoothingFactor, setSmoothingFactor] = useState(0.05);
  const [hitSlop, setHitSlop] = useState(30);

  useEffect(() => {
    const rawData = dataSource === 1 ? data1 : data2;
    const simplifiedData = simplifying
      ? simplifyData(rawData, pickRange, includeExtremes)
      : rawData;
    const intepolatedData = (() => {
      // eslint-disable-next-line default-case
      switch (interpolationStrategy) {
        case 'none':
          return simplifiedData;
        case 'b':
          return bSplineInterpolation({
            data: simplifiedData,
            degree: bSplineDegree,
            range: numberOfPointsInterpolated,
          });
        case 'mono':
          return monotoneCubicInterpolation({
            data: simplifiedData,
            range: numberOfPointsInterpolated,
          });
      }
    })();
    const data = {
      points: intepolatedData,
      smoothingFactor: smoothingStrategy === 'none' ? 0 : smoothingFactor,
      smoothingStrategy,
    };
    setData(data);
  }, [
    bSplineDegree,
    dataSource,
    includeExtremes,
    interpolationStrategy,
    numberOfPointsInterpolated,
    pickRange,
    simplifying,
    smoothingFactor,
    smoothingStrategy,
  ]);

  return (
    <ChartPathProvider data={data}>
      {/* <View
        style={{
          flex: 1,
          flexDirection: 'column',
          // backgroundColor: 'black',
        }}
      > */}
      <ChartYLabel format={formatY} style={{ color: 'green', margin: 4 }} />
      <ChartXLabel format={formatDatetime} style={{ color: 'red', margin: 4 }} />
      <ChartContainer>
        {/* <Labels color="black" width={SIZE} /> */}
        <ChartPath
          hapticsEnabled={hapticsEnabled}
          hitSlop={hitSlop}
          smoothingWhileTransitioningEnabled={smoothingWhileTransitioningEnabled}
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
      {/* </View> */}
    </ChartPathProvider>
  );
};

export default GenericExample;
