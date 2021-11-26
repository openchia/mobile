import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import CustomCard from '../../components/CustomCard';
import PartialChart from '../../screens/farmer/PartialChart';
import { PartChartIntervals } from '../Constants';

export const { width } = Dimensions.get('window');

const SELECTION_WIDTH = width - 32;
const BUTTON_WIDTH = (width - 32) / PartChartIntervals.length;

const PartialChartProvider = ({ data }) => {
  const { globalData, extraData } = data;
  const theme = useTheme();
  const transition = useSharedValue(0);
  const current = useSharedValue(4);
  const { t } = useTranslation();

  const [partials, setPartials] = useState(globalData[current.value]);
  const stats = useSharedValue(extraData[current.value]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(BUTTON_WIDTH * current.value) }],
  }));

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <PartialChart partials={partials} stats={stats}>
        <CustomCard style={{ marginTop: 16 }}>
          <View style={styles.selection}>
            <View
              style={[StyleSheet.absoluteFill, { marginTop: 4, marginBottom: 4, marginStart: 4 }]}
            >
              <Animated.View
                style={[
                  styles.backgroundSelection,
                  { backgroundColor: theme.colors.accent },
                  style,
                ]}
              />
            </View>
            {PartChartIntervals.map((item, index) => (
              <TouchableWithoutFeedback
                key={item.label}
                onPress={() => {
                  transition.value = 0;
                  current.value = index;
                  transition.value = withTiming(1);
                  setPartials(globalData[index]);
                  stats.value = extraData[index];
                  //   setStats(extraData[index]);
                }}
              >
                <Animated.View style={[styles.labelContainer]}>
                  <Text
                    adjustsFontSizeToFit
                    style={[styles.label, { color: theme.colors.jellyBarText }]}
                  >
                    {t(`${item.label}`)}
                  </Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </CustomCard>
      </PartialChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // backgroundColor: 'white',
  },
  backgroundSelection: {
    ...StyleSheet.absoluteFillObject,
    width: BUTTON_WIDTH - 6,
    borderRadius: 8,
  },
  selection: {
    display: 'flex',
    // marginTop: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default PartialChartProvider;
