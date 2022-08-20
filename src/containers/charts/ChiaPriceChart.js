/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-else-return */
/* eslint-disable no-plusplus */
import {
  Canvas,
  Easing,
  Group,
  LinearGradient,
  Paint,
  Path,
  runSpring,
  runTiming,
  useComputedValue,
  useValue,
  useValueEffect,
  vec,
} from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selector, selectorFamily, useRecoilValueLoadable, waitForAll } from 'recoil';
import { currencyState } from '../../recoil/Atoms';
import { api, COINGECKO_API } from '../../services/Api';
import createGraphPath, { getPointAtPositionInPath } from './new/CreateGraphPath';
import Cursor from './new/Cursor';
import { getSixDigitHex } from './new/getSixDigitHex';
import { getYForX } from './new/GetYForX';
import { JellySelector } from './new/JellySelector';
import { Label } from './new/Label';
import { useGraphTouchHandler } from './new/useGraphTouchHandler';

const ITEMS = [
  // {
  //   label: '1h',
  //   value: 1,
  //   interval: 1,
  // },
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

export const fetchPrices = selectorFamily({
  key: 'pricesQuery',
  get:
    ({ element, currency }) =>
    async () => {
      const response = await api({
        baseURL: COINGECKO_API,
        url: `coins/chia/market_chart?vs_currency=${currency}&days=${
          element.value || 'max'
        }&interval=${element.interval || 1}`,
      });
      return response.prices;
    },
});

export const query = selector({
  key: 'prices',
  get: ({ get }) => {
    const currency = get(currencyState);
    const data = get(waitForAll(ITEMS.map((item) => fetchPrices({ element: item, currency }))));
    return data;
  },
});

const Chart = ({
  graphs,
  chiaPrice,
  element,
  bottomContent,
  enableFadeInMask = false,
  width = 200,
  height = 300,
  margin,
  xMax,
  yMax,
  color = '#3AAC59',
}) => {
  const transition = useValue(4);
  const currentState = useValue(0);
  const nextState = useValue(0);
  const stateChanged = useValue(0);
  const gestureActive = useValue(false);
  const minX = useValue(graphs[currentState.current].xMinValue);
  const maxX = useValue(graphs[currentState.current].xMaxValue);
  const x = useValue(0);
  const y = useValue(0);
  const pathEnd = useValue(1);
  const theme = useTheme();

  const gradientColors = useMemo(() => {
    if (enableFadeInMask) {
      return [
        `${getSixDigitHex(color)}00`,
        `${getSixDigitHex(color)}ff`,
        `${getSixDigitHex(color)}ff`,
        `${getSixDigitHex(color)}33`,
        `${getSixDigitHex(color)}33`,
      ];
    } else {
      return [color, color, color, `${getSixDigitHex(color)}33`, `${getSixDigitHex(color)}33`];
    }
  }, [color, enableFadeInMask]);

  const path = useComputedValue(() => {
    const start = graphs[currentState.current].path;
    const end = graphs[nextState.current].path;
    return end.interpolate(start, transition.current);
  }, [currentState, nextState, transition]);

  const positions = useComputedValue(
    () => [0, Math.min(0.15, pathEnd.current), pathEnd.current, pathEnd.current, 1],
    [pathEnd]
  );

  useValueEffect(x, () => {
    // const yPos = getYForX(path.current.toCmds(), x.current);
    // if (yPos) {
    //   y.current = yPos;
    // }
    // y.current = getYForX(path.current.toCmds(), x.current);
    y.current = getPointAtPositionInPath(
      x.current,
      xMax,
      graphs[currentState.current].points.length,
      path.current
    ).y;
  });

  const onTouch = useGraphTouchHandler(x, y, xMax, width, margin, gestureActive, pathEnd);

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ width, height }} onTouch={onTouch}>
        <Label
          gestureActive={gestureActive}
          price={chiaPrice}
          currentState={currentState}
          nextState={nextState}
          y={y}
          x={x}
          yMax={yMax}
          xMax={xMax}
          graphs={graphs}
          width={width}
          height={height}
          margin={margin}
          minX={minX}
          maxX={maxX}
          theme={theme}
        />
        <Group transform={[{ translateY: margin.top }, { translateX: margin.left }]}>
          <Path style="stroke" path={path} strokeWidth={2.5} strokeJoin="round" strokeCap="round">
            <LinearGradient
              start={vec(0, 0)}
              end={vec(width, 0)}
              colors={gradientColors}
              positions={positions}
            />
          </Path>
          <Cursor x={x} y={y} color={color} gestureActive={gestureActive} pathEnd={pathEnd} />
        </Group>
      </Canvas>
      <JellySelector
        onPress={(index) => {
          stateChanged.current = index;
          runTiming(minX, graphs[index].xMinValue, {
            easing: Easing.linear,
            duration: 200,
          });
          runTiming(maxX, graphs[index].xMaxValue, {
            easing: Easing.linear,
            duration: 200,
          });
        }}
        currentState={currentState}
        nextState={nextState}
        transition={transition}
        jellyData={ITEMS}
        theme={theme}
      />
    </View>
  );
};

const ChiaPriceChart = ({ chiaPrice, margin = { top: 140, right: 20, bottom: 40, left: 20 } }) => {
  const { width, height } = useWindowDimensions();

  const loadableData = useRecoilValueLoadable(query);
  const yMax = height / 2 - margin.bottom - margin.top;
  const xMax = width - margin.left - margin.right;

  const graphs = useMemo(() => {
    if (loadableData.state === 'hasValue') {
      const response = loadableData.contents;
      return ITEMS.map((item, index) =>
        createGraphPath({
          data: response[index],
          label: `${item}`,
          xMax,
          yMax,
          xAccessor: (d) => d[0],
          yAccessor: (d) => d[1],
        })
      );
    }
  }, [loadableData.contents, loadableData.state, xMax, yMax]);

  if (!graphs) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ height: height / 2, justifyContent: 'center' }}>
          <ActivityIndicator size={36} color="#119400" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Chart
        height={height / 2}
        width={width}
        graphs={graphs}
        xMax={xMax}
        yMax={yMax}
        margin={margin}
        chiaPrice={chiaPrice}
      />
    </SafeAreaView>
  );
};

export default ChiaPriceChart;
