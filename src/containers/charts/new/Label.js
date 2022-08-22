/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  Group,
  Image,
  interpolate,
  Path,
  Skia,
  Text,
  useComputedValue,
  useFont,
  useImage,
  useValueEffect,
} from '@shopify/react-native-skia';
import React from 'react';
import { format } from 'date-fns';
import { useTheme } from 'react-native-paper';

const LabelContents = ({
  price,
  currentState,
  gestureActive,
  nextState,
  y,
  x,
  yMax,
  xMax,
  graphs,
  margin,
  width,
  minX,
  maxX,
  priceFormat = (val) => `$${val.toFixed(2)}`,
  font,
  priceFont,
  percentChangeFont,
  minMaxFont,
  theme,
  image,
}) => {
  const [active, setActive] = React.useState(false);

  console.log(y.current)

  useValueEffect(gestureActive, () => {
    setActive(gestureActive.current);
  });

  const text = useComputedValue(() => {
    if (!gestureActive.current) {
      return priceFormat(price);
    }
    const graph = graphs[nextState.current];
    return priceFormat(interpolate(y.current, [0, yMax], [graph.maxValue, graph.minValue]));
  }, [y, gestureActive]);

  const dateText = useComputedValue(() => {
    const graph = graphs[nextState.current];
    return `${format(
      interpolate(x.current, [0, xMax], [graph.minDate, graph.maxDate]),
      'MMM dd p'
    )}`;
    // const xPos = getPointAtPositionInPath(
    //   x.current,
    //   xMax,
    //   graphs[currentState.current].steps,
    //   graphs[currentState.current].path
    // ).x;
    // console.log(graphs[currentState.current].steps);
    // console.log((x.current * width) / xMax);
    // console.log(xPos, x);
    // return `sdfsdf`;
  }, [x, gestureActive]);

  const minPriceText = useComputedValue(() => {
    const graph = graphs[nextState.current];
    return priceFormat(graph.minValue);
  }, [nextState]);

  const maxPriceText = useComputedValue(() => {
    const graph = graphs[nextState.current];
    return priceFormat(graph.maxValue);
  }, [nextState]);

  const marginTop = 16;

  const pathValue = useComputedValue(() => {
    const graph = graphs[nextState.current];
    const path = Skia.Path.Make();
    const width = percentChangeFont.getSize() / 2;
    if (graph.percentChange.increase) {
      path.moveTo(width / 2, -width);
      path.lineTo(width, -width / 3);
      path.lineTo(0, -width / 3);
    } else {
      path.moveTo(0, -width);
      path.lineTo(width, -width);
      path.lineTo(width / 2, -width / 3);
    }
    path.close();
    const textPath = Skia.Path.MakeFromText(
      `${graph.percentChange.value.toFixed(2)}%`,
      width + 4,
      0,
      percentChangeFont
    );
    path.op(textPath, 2);
    return path;
  }, [nextState]);

  const percentageColor = useComputedValue(() => {
    const graph = graphs[nextState.current];
    return graph.percentChange.increase ? theme.colors.green : theme.colors.red;
  }, [nextState]);

  return (
    <>
      {!active ? (
        <Text
          x={margin.left}
          y={font.getSize() + marginTop}
          text={format(new Date(Date.now()), 'MMM MM p')}
          font={font}
          color={theme.colors.text}
        />
      ) : (
        <Text
          x={margin.left}
          y={font.getSize() + marginTop}
          text={dateText}
          font={font}
          color={theme.colors.text}
        />
      )}
      <Text
        x={margin.left}
        y={font.getSize() + priceFont.getSize() + marginTop}
        text={text}
        font={priceFont}
        color={theme.colors.text}
      />
      <Group
        transform={[
          {
            translateY:
              font.getSize() + priceFont.getSize() + marginTop + percentChangeFont.getSize() + 8,
          },
          { translateX: margin.left },
        ]}
      >
        <Path path={pathValue} color={percentageColor} />
      </Group>

      <Text
        x={maxX}
        y={margin.top - 4}
        text={maxPriceText}
        font={minMaxFont}
        color={theme.colors.text}
      />
      <Text
        x={minX}
        y={margin.top + yMax + font.getSize() + 4}
        text={minPriceText}
        font={minMaxFont}
        color={theme.colors.text}
      />
    </>
  );
};

export const Label = ({
  price,
  currentState,
  gestureActive,
  nextState,
  theme,
  y,
  x,
  yMax,
  xMax,
  graphs,
  width,
  margin,
  minX,
  maxX,
  format = (val) => `$${val.toFixed(2)}`,
}) => {
  const font = useFont(require('../../../../assets/fonts/Poppins-SemiBold.ttf'), 16);
  const priceFont = useFont(require('../../../../assets/fonts/Inter-Bold.otf'), 32);
  const percentChangeFont = useFont(require('../../../../assets/fonts/Inter-Bold.otf'), 16);
  const minMaxFont = useFont(require('../../../../assets/fonts/Inter-Bold.otf'), 10);
  const image = useImage(require('../../../assets/images/chia_logo.png'));

  if (
    font === null ||
    priceFont == null ||
    percentChangeFont == null ||
    minMaxFont == null ||
    image == null
  ) {
    return null;
  }

  return (
    <LabelContents
      price={price}
      currentState={currentState}
      gestureActive={gestureActive}
      nextState={nextState}
      y={y}
      x={x}
      yMax={yMax}
      xMax={xMax}
      graphs={graphs}
      margin={margin}
      width={width}
      minX={minX}
      maxX={maxX}
      priceFormat={format}
      font={font}
      priceFont={priceFont}
      percentChangeFont={percentChangeFont}
      minMaxFont={minMaxFont}
      image={image}
      theme={theme}
    />
  );
};
