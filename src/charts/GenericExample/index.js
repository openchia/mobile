import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
  simplifyData,
} from '../../react-native-animated-charts';

import bSplineInterpolation from '../../react-native-animated-charts/interpolations/bSplineInterpolation';
import { data1, data2 } from './data';

export const { width: SIZE } = Dimensions.get('window');

export const formatUSD = (value) => {
  'worklet';

  if (value === '') {
    return '';
  }
  return `$ ${value.toLocaleString('en-US', {
    currency: 'USD',
  })}`;
};

export const formatDatetime = (value) => {
  'worklet';

  if (value === '') {
    return '';
  }
  const date = new Date(Number(value * 1000));
  const s = date.getSeconds();
  const m = date.getMinutes();
  const h = date.getHours();
  const d = date.getDate();
  const n = date.getMonth();
  const y = date.getFullYear();
  return `${y}-${n}-${d} ${h}:${m}:${s}`;
};

function GenericExample() {
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
    <View
      style={
        {
          // backgroundColor: 'black',
        }
      }
    >
      <ScrollView style={{}}>
        <ChartPathProvider data={data}>
          <ChartYLabel format={formatUSD} style={{ color: 'green', margin: 4 }} />
          <ChartXLabel format={formatDatetime} style={{ color: 'red', margin: 4 }} />
          <ChartPath
            hapticsEnabled={hapticsEnabled}
            hitSlop={hitSlop}
            smoothingWhileTransitioningEnabled={smoothingWhileTransitioningEnabled}
            fill="none"
            height={SIZE / 2}
            stroke="red"
            strokeWidth="2"
            width={SIZE}
          />
          <ChartDot
            style={{
              top: 200,
              // justifyContent: 'center',
              backgroundColor: 'blue',
            }}
          />
        </ChartPathProvider>
      </ScrollView>
    </View>
  );
}

export default GenericExample;
