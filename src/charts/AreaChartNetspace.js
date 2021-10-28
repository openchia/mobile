import React, { useRef, useState } from 'react';
import { AreaChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import dateFns from 'date-fns';
import { PanResponder, Dimensions, Text, TouchableOpacity, View } from 'react-native';
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
import { getNetspace } from '../Api';

// const xAxis = (d) => d.date; // objKey;
// const yAxis = (d) => d.size; // convert from Kgs to Tons

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const AreaChartNetspace = ({ data }) => {
  const apx = (size = 0) => {
    const { width } = Dimensions.get('window');
    return (width / 750) * size;
  };
  const dateList = data.map((item) => item.date); // objKey;
  const priceList = data.map((item) => item.size); // objKey;

  return (
    <View style={{ flexDirection: 'row', height: 200 }}>
      <YAxis
        style={{ marginStart: 10 }}
        data={data.map((item) => item.size)}
        contentInset={{ top: 10, bottom: 10 }}
        formatLabel={(value) => formatBytes(value)}
        min={0}
        numberOfTicks={6}
        // yScale={scale.scaleLinear}
        svg={{
          fontSize: 10,
          fill: 'black',
          // stroke: 'black',
          // strokeWidth: 0.1,
          // alignmentBaseline: 'baseline',
          // baselineShift: '3',
        }}
      />
      <View style={{ flex: 1, marginEnd: 20 }}>
        <AreaChart
          numberOfTicks={8}
          style={{ height: 200, margin: 4, flex: 1 }}
          data={data.map((item) => item.size)}
          contentInset={{ top: 10, bottom: 10 }}
          curve={shape.curveNatural}
          svg={{ fill: '#41AF33', stroke: '#22611a' }}
        >
          <Grid />
        </AreaChart>
      </View>
    </View>
  );
};

export default AreaChartNetspace;
