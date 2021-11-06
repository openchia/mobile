import React, { useCallback, useMemo, useState } from 'react';
import { Text } from 'react-native-paper';
import { useChartData } from '../react-native-animated-charts';

function trim(val) {
  return Math.min(Math.max(val, 0.05), 0.95);
}

// const Label = styled(Text)`
//   font-size: ${fonts.size.smedium};
//   font-weight: ${fonts.weight.bold};
//   letter-spacing: ${fonts.letterSpacing.roundedTighter};
//   position: absolute;
//   text-align: center;
// `;

const CenteredLabel = ({ position, style, width, ...props }) => {
  const [componentWidth, setWidth] = useState(0);
  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width: newWidth },
      },
    }) => {
      setWidth(newWidth);
    },
    [setWidth]
  );

  const left = useMemo(
    () =>
      Math.max(
        Math.floor(Math.min(width * position - componentWidth / 2, width - componentWidth - 10)),
        10
      ),
    [componentWidth, position, width]
  );
  return (
    <Text
      {...props}
      onLayout={onLayout}
      style={{
        ...style,
        postion: 'absolute',
        textAlign: 'center',
        left,
        opacity: componentWidth ? 1 : 0,
      }}
    />
  );
};

export default function Labels({ color, width }) {
  // const { nativeCurrency } = useAccountSettings();
  // const nativeSelected = get(supportedNativeCurrencies, `${nativeCurrency}`);
  const { greatestX, greatestY, smallestX, smallestY } = useChartData();

  if (!greatestX) {
    return null;
  }
  const positionMin = trim((smallestY.x - smallestX.x) / (greatestX.x - smallestX.x));
  const positionMax = trim((greatestY.x - smallestX.x) / (greatestX.x - smallestX.x));

  return (
    <>
      {positionMin ? (
        <CenteredLabel
          // color={colors.alpha(color, 0.8)}
          color={color}
          position={positionMin}
          style={{
            bottom: -20,
          }}
          width={width}
        >
          hello
          {/* {formatNative(smallestY.y, null, nativeSelected)} */}
        </CenteredLabel>
      ) : null}
      {positionMax ? (
        <CenteredLabel
          // color={colors.alpha(color, 0.8)}
          color={color}
          position={positionMax}
          style={{
            top: -20,
          }}
          width={width}
        >
          test
          {/* {formatNative(greatestY.y, null, nativeSelected)} */}
        </CenteredLabel>
      ) : null}
    </>
  );
}
