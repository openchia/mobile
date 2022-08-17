/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
import { Skia } from '@shopify/react-native-skia';
import d3 from 'd3';
import {
  curveBumpX,
  curveBundle,
  curveCardinal,
  curveCatmullRom,
  curveLinearClosed,
  curveNatural,
  line as d3Line,
} from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { curveBasis } from 'd3-shape';

const PIXEL_RATIO = 2;

export const getPointAtPositionInPath = (x, width, steps, path) => {
  const index = Math.max(0, Math.floor(x / (width / steps)));
  const fraction = (x / (width / steps)) % 1;
  const p1 = path.getPoint(index);
  if (index < path.countPoints() - 1) {
    const p2 = path.getPoint(index + 1);
    // Interpolate between p1 and p2
    return {
      x: p1.x + (p2.x - p1.x) * fraction,
      y: p1.y + (p2.y - p1.y) * fraction,
    };
  }
  return p1;
};

const changePercentage = (data, yAccessor) => {
  const startVal = yAccessor(data[0]);
  const endVal = yAccessor(data[data.length - 1]);
  let value = 0;
  if (endVal > startVal) {
    value = ((endVal - startVal) / startVal) * 100;
  } else {
    value = ((startVal - endVal) / endVal) * 100;
  }
  return { value, increase: endVal > startVal };
};

function createGraphPath({ data, label, xMax, yMax, area = false, xAccessor, yAccessor }) {
  const dates = data.map(xAccessor);
  const values = data.map(yAccessor);

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);

  const percentageChange = changePercentage(data, yAccessor);

  const areValuesSame = minValue === maxValue;
  const points = [];
  const newYMax = area ? yMax - 20 : yMax;

  let xMinValue = 0;
  let smallestValue = maxValue;
  let xMaxValue = 0;
  let biggestValue = minValue;

  for (let pixel = 0; pixel < xMax; pixel += PIXEL_RATIO) {
    const index = Math.floor((pixel / xMax) * data.length);
    const value = yAccessor(data[index]) ?? minValue;

    const x = pixel;
    const y = areValuesSame
      ? newYMax / 2
      : newYMax - ((value - minValue) / (maxValue - minValue)) * newYMax;

    if (value <= smallestValue) {
      smallestValue = value;
      xMinValue = x;
    }
    if (value >= biggestValue) {
      biggestValue = value;
      xMaxValue = x;
    }
    points.push({ x, y });
  }

  const path = Skia.Path.Make();
  const areaPath = Skia.Path.Make();

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (i === 0) path.moveTo(point.x, point.y);
    path.lineTo(point.x, point.y);
    if (area) areaPath.lineTo(point.x, point.y);
  }

  // const xScale = scaleLinear()
  //   .domain(extent(points, (d) => d.x))
  //   .range([0, xMax]);

  // const yScale = scaleLinear()
  //   .domain(extent(points, (d) => d.y))
  //   .range([0, yMax]);

  // const line = d3Line()
  //   .curve(curveBasis)
  //   .x((d) => xScale(d.x))
  //   .y((d) => yScale(d.y));

  if (area) {
    areaPath.lineTo(points[points.length - 1].x + 1.5, points[points.length - 1].y);
    areaPath.lineTo(points[points.length - 1].x + 1.5, yMax);
    areaPath.lineTo(-1.5, yMax);
    areaPath.lineTo(-1.5, points[0].y);
    areaPath.lineTo(points[0].x, points[0].y);
  }

  return {
    label,
    minValue,
    maxValue,
    minDate,
    maxDate,
    xMinValue,
    xMaxValue,
    percentChange: percentageChange,
    path,
    // path: Skia.Path.MakeFromSVGString(line(points)),
    areaPath,
    points,
  };
}

// function createGraphPath(data, label, height, width, xMax, yMax, area = false) {
//   const graphData = data.map((item) => ({ value: item[1], date: item[0] }));

// const startVal = graphData[0].value;
// const endVal = graphData[graphData.length - 1].value;
// let percentChange = 0;
// if (endVal > startVal) {
//   percentChange = ((endVal - startVal) / startVal) * 100;
// } else {
//   percentChange = ((startVal - endVal) / endVal) * 100;
// }

//   const maxValue = graphData.reduce(
//     (prev, curr) => (curr.value > prev ? curr.value : prev),
//     Number.MIN_SAFE_INTEGER
//   );
//   const minValue = graphData.reduce(
//     (prev, curr) => (curr.value < prev ? curr.value : prev),
//     Number.MAX_SAFE_INTEGER
//   );

//   const dates = data.map((value) => value[0]);
//   const minDate = Math.min(...dates);
//   const maxDate = Math.max(...dates);

//   const areValuesSame = minValue === maxValue;

// let xMinPrice = 0;
// let smallestValue = maxValue;
// let xMaxPrice = 0;
// let biggestValue = minValue;

//   const points = [];

//   const newYMax = area ? yMax - 20 : yMax;

//   for (let pixel = 0; pixel < width; pixel += PIXEL_RATIO) {
//     const index = Math.floor((pixel / width) * graphData.length);
//     const value = graphData[index]?.value ?? minValue;
//     const date = graphData[index]?.date;

//     const x = (pixel / width) * xMax;
//     const y = areValuesSame
//       ? height / 2
//       : newYMax - ((value - minValue) / (maxValue - minValue)) * newYMax;

//     if (value <= smallestValue) {
//       smallestValue = value;
//       xMinPrice = x;
//     }
//     if (value >= biggestValue) {
//       biggestValue = value;
//       xMaxPrice = x;
//     }
//     points.push({ x, y });
//   }

//   const path = Skia.Path.Make();
//   const areaPath = Skia.Path.Make();

//   for (let i = 0; i < points.length; i++) {
//     const point = points[i];
//     if (i === 0) path.moveTo(point.x, point.y);
//     path.lineTo(point.x, point.y);
//     if (area) areaPath.lineTo(point.x, point.y);
//   }

//   if (area) {
//     areaPath.lineTo(points[points.length - 1].x + 1.5, points[points.length - 1].y);
//     areaPath.lineTo(points[points.length - 1].x + 1.5, yMax);
//     areaPath.lineTo(-1.5, yMax);
//     areaPath.lineTo(-1.5, points[0].y);
//     areaPath.lineTo(points[0].x, points[0].y);
//   }

//   return {
//     label,
//     minPrice: minValue,
//     maxPrice: maxValue,
//     minDate,
//     maxDate,
//     increase: endVal > startVal,
//     xMinPrice,
//     xMaxPrice,
//     percentChange,
//     path,
//     areaPath,
//     graphData,
//     points,
//     steps: points.length,
//   };
// }

export function createRoundGraphPath(graphData, label, height, width, xMax, yMax, area = false) {
  // const graphData = data.map((item) => ({ value: item[1], datetime: item[0] }));

  const startVal = graphData[0].value;
  const endVal = graphData[graphData.length - 1].value;
  let percentChange = 0;
  if (endVal > startVal) {
    percentChange = ((endVal - startVal) / startVal) * 100;
  } else {
    percentChange = ((startVal - endVal) / endVal) * 100;
  }

  const maxValue = graphData.reduce(
    (prev, curr) => (curr.value > prev ? curr.value : prev),
    Number.MIN_SAFE_INTEGER
  );
  const minValue = graphData.reduce(
    (prev, curr) => (curr.value < prev ? curr.value : prev),
    Number.MAX_SAFE_INTEGER
  );
  const areValuesSame = minValue === maxValue;

  let xMinValue = 0;
  let smallestValue = maxValue;
  let xMaxValue = 0;
  let biggestValue = minValue;

  const points = [];

  const newYMax = area ? yMax - 20 : yMax;

  // const path = Skia.Path.Make();
  for (let pixel = 0; pixel < width; pixel += PIXEL_RATIO) {
    const index = Math.floor((pixel / width) * graphData.length);
    const value = graphData[index]?.value ?? minValue;

    const x = (pixel / width) * xMax;
    const y = areValuesSame
      ? height / 2
      : newYMax - ((value - minValue) / (maxValue - minValue)) * newYMax;

    if (value <= smallestValue) {
      smallestValue = value;
      xMinValue = x;
    }
    if (value >= biggestValue) {
      biggestValue = value;
      xMaxValue = x;
    }
    points.push({ x, y, value });
  }

  // console.log(points);

  const xScale = scaleLinear()
    .domain(extent(points, (d) => d.x))
    .range([0, xMax])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(points, (d) => d.y))
    .range([yMax, 0])
    .nice();

  const line = d3Line()
    // .curve(curveNatural)
    .curve(curveCardinal.tension(0.8))
    // .curve(curveBasis)
    // .curve(curveCatmullRom.alpha(0.9))

    // .curve(curveBundle.beta(0.5))
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  // return Skia.Path.MakeFromSVGString(line(data));

  return {
    label,
    minValue,
    maxValue,
    increase: endVal > startVal,
    xMinValue,
    xMaxValue,
    percentChange,
    path: Skia.Path.MakeFromSVGString(line(points)),
    // areaPath,
    steps: points.length,
  };
}

// export function createRoundGraphPath(data, label, height, width, xMax, yMax, area = false) {
//   const graphData = data.map((item) => ({ value: item[1], date: item[0] }));

//   const startVal = graphData[0].value;
//   const endVal = graphData[graphData.length - 1].value;
//   let percentChange = 0;
//   if (endVal > startVal) {
//     percentChange = ((endVal - startVal) / startVal) * 100;
//   } else {
//     percentChange = ((startVal - endVal) / endVal) * 100;
//   }

//   const maxValue = graphData.reduce(
//     (prev, curr) => (curr.value > prev ? curr.value : prev),
//     Number.MIN_SAFE_INTEGER
//   );
//   const minValue = graphData.reduce(
//     (prev, curr) => (curr.value < prev ? curr.value : prev),
//     Number.MAX_SAFE_INTEGER
//   );
//   const areValuesSame = minValue === maxValue;

//   let xMinPrice = 0;
//   let smallestValue = maxValue;
//   let xMaxPrice = 0;
//   let biggestValue = minValue;

//   const points = [];

//   const newYMax = area ? yMax - 20 : yMax;

//   // const path = Skia.Path.Make();
//   const areaPath = Skia.Path.Make();
//   for (let pixel = 0; pixel < width; pixel += PIXEL_RATIO) {
//     const index = Math.floor((pixel / width) * graphData.length);
//     const value = graphData[index]?.value ?? minValue;

//     const x = (pixel / width) * xMax;
//     const y = areValuesSame
//       ? height / 2
//       : newYMax - ((value - minValue) / (maxValue - minValue)) * newYMax;

//     if (value <= smallestValue) {
//       smallestValue = value;
//       xMinPrice = x;
//     }
//     if (value >= biggestValue) {
//       biggestValue = value;
//       xMaxPrice = x;
//     }
//     points.push({ x, y });
//   }

//   console.log(graphData.length, points.length);

//   const path = curveLines(points, 20, 'bezier');
//   return {
//     label,
//     minPrice: minValue,
//     maxPrice: maxValue,
//     increase: endVal > startVal,
//     xMinPrice,
//     xMaxPrice,
//     percentChange,
//     path,
//     areaPath,
//     steps: points.length,
//   };
// }

export default createGraphPath;
