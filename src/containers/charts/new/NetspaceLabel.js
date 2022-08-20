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
import filesize from 'filesize';
import { format } from 'date-fns';

const LabelContents = ({
  defaultVal,
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
  netspaceFormat,
  font,
  priceFont,
  percentChangeFont,
  minMaxFont,
  image,
  theme,
}) => {
  const [active, setActive] = React.useState(false);

  useValueEffect(gestureActive, () => {
    setActive(gestureActive.current);
  });

  const text = useComputedValue(() => {
    if (!gestureActive.current) {
      return defaultVal;
    }
    const graph = graphs[nextState.current];
    return netspaceFormat(interpolate(y.current, [0, yMax], [graph.maxValue, graph.minValue]));
  }, [y, gestureActive]);

  const dateText = useComputedValue(() => {
    const graph = graphs[nextState.current];
    return `${format(
      interpolate(x.current, [0, xMax], [graph.minDate, graph.maxDate]),
      'MMM dd p'
    )}`;
  }, [x, gestureActive]);
  const marginTop = 16;

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
    </>
  );
};

const NetspaceLabel = ({
  defaultVal,
  currentState,
  gestureActive,
  nextState,
  y,
  x,
  yMax,
  xMax,
  graphs,
  width,
  margin,
  minX,
  maxX,
  format = (val) => `${(val / 1024 ** 4).toFixed(2).toString()} EiB`,
  theme,
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
      defaultVal={defaultVal}
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
      netspaceFormat={format}
      font={font}
      priceFont={priceFont}
      percentChangeFont={percentChangeFont}
      minMaxFont={minMaxFont}
      image={image}
      theme={theme}
    />
  );
};

export default NetspaceLabel;
