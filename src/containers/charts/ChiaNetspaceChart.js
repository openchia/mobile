/* eslint-disable react/style-prop-object */
/* eslint-disable no-else-return */
/* eslint-disable no-plusplus */
import {
  Canvas,
  Easing,
  Group,
  LinearGradient,
  Path,
  runSpring,
  runTiming,
  useComputedValue,
  useValue,
  useValueEffect,
  vec,
} from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, SafeAreaView, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import {
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValueLoadable,
  waitForAll,
} from 'recoil';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
} from '../../react-native-animated-charts';
import { settingsState } from '../../recoil/Atoms';
import { api, SPACESCAN_API } from '../../services/Api';
import createGraphPath, {
  createRoundGraphPath,
  getPointAtPositionInPath,
} from './new/CreateGraphPath';
import Cursor from './new/Cursor';
import { getSixDigitHex } from './new/getSixDigitHex';
import { getYForX } from './new/GetYForX';
import { JellySelector } from './new/JellySelector';
import { Label } from './new/Label';
import NetspaceLabel from './new/NetspaceLabel';
import { useGraphTouchHandler } from './new/useGraphTouchHandler';

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

// const query = selectorFamily({
//   key: 'netspace',
//   get:
//     (element) =>
//     async ({ get }) => {
//       const response = await api({ baseURL: SPACESCAN_API, url: `/xch/netspace/${element.value}` });
//       if (response) {
//         const convertedData = [];

//         response.netspace.forEach((item, index) => {
//           convertedData.push({ x: response.timestamp[index] / 1000, y: item });
//         });

//         return monotoneCubicInterpolation({
//           data: convertedData,
//           includeExtremes: true,
//           range: 100,
//         });
//       }
//       return response.statusText;
//     },
// });

const netspaceQuery = selectorFamily({
  key: 'netspaceQuery',
  get:
    ({ element }) =>
    async () => {
      // const convertedData = [];
      const response = await api({
        url: `stats/netspace/?days=${element.value}`,
      });
      // response.netspace.forEach((item, index) => {
      //   convertedData.push([response.timestamp[index] / 1000, item]);
      // });
      // console.log(response);
      // const x = response
      //   .map((item) => ({
      //     date: new Date(item.datetime).getTime(),
      //     value: item.value,
      //   }))
      //   .reverse();

      const x = response.map((item) => [new Date(item.datetime).getTime(), item.value]);
      return x;
    },
});

const query = selector({
  key: 'netspace',
  get: ({ get }) => get(waitForAll(ITEMS.map((item) => netspaceQuery({ element: item })))),
});

const Chart = ({
  graphs,
  netspace,
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
  // const minX = useValue(graphs[currentState.current].xMinPrice);
  // const maxX = useValue(graphs[currentState.current].xMaxPrice);
  const circleRadius = useValue(0);
  const circleStrokeRadius = useComputedValue(() => circleRadius.current * 6, [circleRadius]);
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

  // useValueEffect(x, () => {
  //   y.current = getPointAtPositionInPath(
  //     x.current,
  //     xMax,
  //     graphs[currentState.current].steps,
  //     path.current
  //   ).y;
  // });

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

  useValueEffect(gestureActive, () => {
    runSpring(circleRadius, gestureActive.current ? 5 : 0, {
      mass: 1,
      stiffness: 1000,
      damping: 50,
      velocity: 0,
    });
    if (!gestureActive.current) pathEnd.current = 1;
  });

  const areaPath = useComputedValue(() => {
    const start = graphs[currentState.current].areaPath;
    const end = graphs[nextState.current].areaPath;
    return end.interpolate(start, transition.current);
  }, [currentState, nextState, transition]);

  const onTouch = useGraphTouchHandler(x, y, xMax, width, margin, gestureActive, pathEnd);

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ width, height }} onTouch={onTouch}>
        <NetspaceLabel
          gestureActive={gestureActive}
          defaultVal={netspace}
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
          <Path style="stroke" path={path} strokeWidth={3} strokeJoin="round" strokeCap="round">
            <LinearGradient
              start={vec(0, 0)}
              end={vec(width, 0)}
              colors={gradientColors}
              positions={positions}
            />
          </Path>
          <Path style="fill" path={areaPath}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, yMax)}
              colors={[
                'rgba(92, 209, 124, 0.8)',
                'rgba(92, 209, 124, 0.5)',
                'rgba(92, 209, 124, 0.4)',
                'rgba(92, 209, 124, 0.2)',
                'rgba(92, 209, 124, 0.1)',
                'rgba(92, 209, 124, 0.05)',
                'rgba(92, 209, 124, 0)',
              ]}
            />
          </Path>
          <Cursor
            x={x}
            y={y}
            color={theme.colors.text}
            shadowColor={theme.colors.text}
            gestureActive={gestureActive}
            pathEnd={pathEnd}
            theme={theme}
          />

          {/* <Cursor
            x={x}
            y={y}
            width={width}
            circleRadius={circleRadius}
            circleStrokeRadius={circleStrokeRadius}
            color={color}
          /> */}
        </Group>
      </Canvas>
      <JellySelector
        onPress={(index) => {
          stateChanged.current = index;
          // runTiming(minX, graphs[index].xMinPrice, {
          //   easing: Easing.linear,
          //   duration: 200,
          // });
          // runTiming(maxX, graphs[index].xMaxPrice, {
          //   easing: Easing.linear,
          //   duration: 200,
          // });
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

const NetspaceChart = ({ netspace, margin = { top: 140, right: 20, bottom: 40, left: 20 } }) => {
  const { width, height } = useWindowDimensions();

  const loadableData = useRecoilValueLoadable(query);
  const yMax = height / 2 - margin.bottom - margin.top;
  const xMax = width - margin.left - margin.right;

  const graphs = useMemo(() => {
    if (loadableData.state === 'hasValue') {
      const response = loadableData.contents;
      // console.log(response);
      return ITEMS.map((item, index) =>
        createGraphPath({
          data: response[index],
          label: `${item}`,
          xMax,
          yMax,
          xAccessor: (d) => d[0],
          yAccessor: (d) => d[1],
          area: true,
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
        netspace={netspace}
      />
    </SafeAreaView>
  );
};

export default NetspaceChart;
