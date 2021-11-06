/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useState } from 'react';
import { AreaChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import dateFns, { isAfter } from 'date-fns';
import { PanResponder, Dimensions, Text, TouchableOpacity, View, Pressable } from 'react-native';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { getNetspace } from '../Api';
import CustomCard from '../components/CustomCard';
import monotoneCubicInterpolation from '../react-native-animated-charts/interpolations/monotoneCubicInterpolation';
import { ChartDot, ChartPath, ChartPathProvider } from '../react-native-animated-charts';
import GenericExample from './GenericExample';

const filterData = (data, timePeriod) => {
  const date = new Date(new Date().getTime() - timePeriod * 60 * 60 * 1000);
  return data.filter((item) => isAfter(new Date(item.date), date));
};

const times = [
  { time: 8, display: '8h' },
  { time: 24, display: '24h' },
  { time: 24 * 7, display: '7D' },
  { time: -1, display: '1M' },
];

const CustomPressable = ({ item, onPress, selected, index }) => (
  <Pressable
    style={({ pressed }) => [
      {
        backgroundColor: selected || pressed ? 'rgba(17, 148, 0, 0.8)' : 'white',
        flex: 1,
        alignItems: 'center',
        borderRadius: 4,
        margin: 4,
      },
    ]}
    onPress={() => {
      onPress(item, index);
    }}
  >
    {({ pressed }) => (
      <Text style={{ color: selected || pressed ? 'white' : 'grey' }}>{item.display}</Text>
    )}
  </Pressable>
);

const CustomChart = ({ data }) => {
  const dateList = data.map((item) => item.date); // objKey;
  const priceList = data.map((item) => item.size); // objKey;

  const apx = (size = 0) => {
    // eslint-disable-next-line prefer-destructuring
    const width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

  const size = useRef(data.length);

  const [positionX, setPositionX] = useState(-1); // The currently selected X coordinate position

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      },
    })
  );

  const updatePosition = (x) => {
    const YAxisWidth = apx(130);
    const x0 = apx(0); // x0 position
    const chartWidth = apx(750) - YAxisWidth - x0;
    const xN = x0 + chartWidth;
    const xDistance = chartWidth / size.current; // The width of each coordinate point
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }

    // console.log((x - x0) )

    // The selected coordinate x :
    // (x - x0)/ xDistance = value
    let value = ((x - x0) / xDistance).toFixed(0);
    if (value >= size.current - 1) {
      value = size.current - 1; // Out of chart range, automatic correction
    }

    setPositionX(Number(value));
  };

  const CustomGradient = () => (
    <Defs key="gradient">
      <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">
        {/* <Stop offset="0%" stopColor="rgb(134, 65, 244)" /> */}
        {/* <Stop offset="100%" stopColor="rgb(66, 194, 244)" /> */}

        <Stop offset="0%" stopColor="#FEBE18" stopOpacity={0.25} />
        <Stop offset="100%" stopColor="#FEBE18" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  );

  const Tooltip = ({ x, y, ticks }) => {
    if (positionX < 0) {
      return null;
    }

    const date = dateList[positionX];
    console.log(x(positionX));

    return (
      <G x={x(positionX)} key="tooltip">
        <G
          x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
          y={y(priceList[positionX]) - apx(10)}
        >
          <Rect
            y={-apx(24 + 24 + 20) / 2}
            rx={apx(12)} // borderRadius
            ry={apx(12)} // borderRadius
            width={apx(300)}
            height={apx(96)}
            stroke="rgba(254, 190, 24, 0.27)"
            fill="rgba(255, 255, 255, 0.8)"
          />

          <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
            {date}
          </SvgText>
          <SvgText
            x={apx(20)}
            y={apx(24 + 20)}
            fontSize={apx(24)}
            fontWeight="bold"
            fill="rgba(224, 188, 136, 1)"
          >
            ${priceList[positionX]}
          </SvgText>
        </G>

        <G x={x}>
          <Line
            y1={ticks[0]}
            y2={ticks[Number(ticks.length)]}
            stroke="#FEBE18"
            strokeWidth={apx(4)}
            strokeDasharray={[6, 3]}
          />

          {/* <Circle
            cy={y(priceList[positionX])}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#FEBE18"
          /> */}
        </G>
      </G>
    );
  };
  const verticalContentInset = { top: apx(40), bottom: apx(40) };

  return (
    <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <View
        style={{
          flexDirection: 'row',
          width: apx(750),
          height: apx(570),
          alignSelf: 'stretch',
        }}
      >
        <View style={{ flex: 1 }} {...panResponder.current.panHandlers}>
          <AreaChart
            style={{ flex: 1 }}
            data={priceList}
            // curve={shape.curveNatural}
            curve={shape.curveMonotoneX}
            contentInset={{ ...verticalContentInset }}
            svg={{ fill: 'rgba(17, 148, 0, 0.8)' }}
          >
            {/* <CustomLine /> */}
            {/* <CustomGrid /> */}
            {/* <CustomGradient /> */}
            <Tooltip />
          </AreaChart>
        </View>
      </View>
    </View>
  );
};

export const { width: SIZE } = Dimensions.get('window');

export const data = [
  { x: 1453075200, y: 1.47 },
  { x: 1453161600, y: 1.37 },
  { x: 1453248000, y: 1.53 },
  { x: 1453334400, y: 1.54 },
  { x: 1453420800, y: 1.52 },
  { x: 1453507200, y: 2.03 },
  { x: 1453593600, y: 2.1 },
  { x: 1453680000, y: 2.5 },
  { x: 1453766400, y: 2.3 },
  { x: 1453852800, y: 2.42 },
  { x: 1453939200, y: 2.55 },
  { x: 1454025600, y: 2.41 },
  { x: 1454112000, y: 2.43 },
  { x: 1454198400, y: 2.2 },
];

const points = monotoneCubicInterpolation({ data, range: 40 });

const AreaChartNetspace = ({ data }) => {
  const [selected, setSelected] = useState(3);
  const [dataState, setData] = useState(data);

  const onPressed = (item, index) => {
    if (item.time === -1) setData(data);
    else setData(filterData(data, item.time));
    setSelected(index);
  };

  return (
    <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomCard
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {times.map((item, index) => (
          <CustomPressable
            key={item.display}
            selected={index === selected}
            item={item}
            index={index}
            onPress={(item, index) => onPressed(item, index)}
          />
        ))}
      </CustomCard>
      <GenericExample />
      {/* <ChartPathProvider data={{ points, smoothingStrategy: 'bezier' }}>
        <ChartPath height={SIZE / 2} stroke="yellow" width={SIZE} />
        <ChartDot style={{ backgroundColor: 'blue' }} />
      </ChartPathProvider> */}
      {/* <CustomChart data={dataState} /> */}
    </View>
  );
};

export default AreaChartNetspace;
