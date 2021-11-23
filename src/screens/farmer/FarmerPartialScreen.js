import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { NetspaceChartIntervals } from '../../charts/Constants';
import TestStackedBarChart from '../../charts/TestStackedBarChart';
import LoadingComponent from '../../components/LoadingComponent';

export const { width } = Dimensions.get('window');

const SELECTION_WIDTH = width - 32;
const BUTTON_WIDTH = (width - 32) / NetspaceChartIntervals.length;

const data = [
  {
    month: new Date(2015, 0, 1),
    apples: 3840,
    bananas: 1920,
    cherries: 960,
    dates: 400,
    oranges: 400,
  },
  {
    month: new Date(2015, 1, 1),
    apples: 1600,
    bananas: 1440,
    cherries: 960,
    dates: 400,
  },
  {
    month: new Date(2015, 2, 1),
    apples: 640,
    bananas: 960,
    cherries: 3640,
    dates: 400,
  },
  {
    month: new Date(2015, 3, 1),
    apples: 3320,
    bananas: 480,
    cherries: 640,
    dates: 400,
  },
];

// const data = [
//   {
//     timestamp: 1637277543,
//     passed: 400,
//     failed: 10,
//   }
// ]

const colors = ['red', 'green'];
const keys = ['failed', 'passed'];

const Content = ({ data }) => {
  const theme = useTheme();
  const transition = useSharedValue(0);
  const previous = useSharedValue(0);
  const current = useSharedValue(0);
  const [initialData, setIntialData] = useState([]);
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    const newData = [];
    let prevTime = 0;
    let x = 0;
    let failed = 0;
    let passed = 0;
    prevTime = Math.floor(data[0].timestamp / 3600) * 3600;
    data.forEach((element) => {
      const hour = Math.floor(element.timestamp / 3600) * 3600;
      if (prevTime === hour) {
        if (element.error) {
          failed += element.difficulty;
        } else {
          passed += element.difficulty;
        }
      } else {
        prevTime = hour;
        newData[x] = { hour, failed, passed };
        failed = 0;
        passed = 0;
        x += 1;
      }
    });
    setTestData(newData);
    setIntialData(newData);
    // console.log(newData);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(BUTTON_WIDTH * current.value) }],
  }));

  // console.log(dataLoadable.contents.partials);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignContent: 'center', justifyContent: 'center', flex: 1 }}>
        <TestStackedBarChart data={testData} height={250} keys={keys} colors={colors} />
        {/* <StackedBarChart
          // style={{ height: 250 }}
          height={250}
          keys={keys}
          colors={colors}
          data={testData}
          // showGrid={false}
          // animate
          // contentInset={{ top: 30, bottom: 30 }}
        /> */}
      </View>
      {/* <CustomCard style={{ marginTop: 16 }}>
        <View style={styles.selection}>
          <View
            style={[StyleSheet.absoluteFill, { marginTop: 4, marginBottom: 4, marginStart: 4 }]}
          >
            <Animated.View style={[styles.backgroundSelection, style]} />
          </View>
          {NetspaceChartIntervals.map((item, index) => (
            <TouchableWithoutFeedback
              key={item.label}
              onPress={() => {
                previous.value = current.value;
                transition.value = 0;
                current.value = index;
                transition.value = withTiming(1);
                // console.log(initialData.slice(0, 5));
                setTestData(initialData.slice(0, index));
              }}
            >
              <Animated.View style={[styles.labelContainer]}>
                <Text
                  adjustsFontSizeToFit
                  style={[
                    styles.label,
                    { color: index === current.value ? 'black' : theme.colors.text },
                  ]}
                >
                  {item.label}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </CustomCard> */}
    </SafeAreaView>
  );
};

const FarmerPartialScreen = ({ navigation, dataLoadable }) => {
  const theme = useTheme();

  if (dataLoadable.state !== 'hasValue') {
    return <LoadingComponent />;
  }

  // console.log(dataLoadable.contents.partials);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Content data={dataLoadable.contents.partials.results} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // backgroundColor: 'white',
  },
  backgroundSelection: {
    backgroundColor: '#f3f3f3',
    ...StyleSheet.absoluteFillObject,
    width: BUTTON_WIDTH - 6,
    borderRadius: 8,
  },
  selection: {
    display: 'flex',
    // marginTop: 16,
    flexDirection: 'row',
    width: SELECTION_WIDTH,
    alignSelf: 'center',
  },
  labelContainer: {
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
    width: BUTTON_WIDTH,
  },
  label: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FarmerPartialScreen;
