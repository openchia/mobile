/* eslint-disable arrow-body-style */
import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import CustomIconButton from '../../../components/CustomIconButton';
import { launcherIDsState } from '../../../recoil/Atoms';
import { api } from '../../../services/Api';
import AnimatedText from './AnimatedText';
import { Platform } from 'react-native';

// const BAR_WIDTH = 350;
const BAR_HEIGHT = 20;

export const clamp = (value, lowerBound, upperBound) => {
  'worklet';

  return Math.min(Math.max(lowerBound, value), upperBound);
};

const SizeDropPercentScreen = ({ navigation, route }) => {
  const { launcherId, token, defaultVal, keyboardType } = route.params;
  const [farms, setLauncherIDs] = useRecoilState(launcherIDsState);
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const MIN = 20;
  const MAX_RANGE = 80;
  const SLIDER_WIDTH = width - width / 8;
  const KNOB_WIDTH = 40;
  const SLIDER_RANGE = SLIDER_WIDTH - KNOB_WIDTH;

  const STEP = SLIDER_RANGE / (MAX_RANGE - MIN) ?? 1;

  const x = useSharedValue(defaultVal ? STEP * (defaultVal - MIN) : 0);
  const pressed = useSharedValue(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginEnd: -12,
            alignItems: 'center',
          }}
        >
          <CustomIconButton
            icon={<Ionicons name="ios-save-outline" size={24} color={theme.colors.textGrey} />}
            color="#fff"
            size={24}
            onPress={() => {
              api({
                method: 'put',
                url: `launcher/${launcherId}/`,
                body: { size_drop_percent: MIN + Math.ceil(x.value / STEP) },
                headers: { Authorization: `Bearer ${token}` },
              })
                .then(() => {
                  const updatedList = farms.map((item) => {
                    return item.launcherId === launcherId
                      ? { ...item, sizeDropPercent: MIN + Math.ceil(x.value / STEP) }
                      : item;
                  });
                  setLauncherIDs(updatedList);
                })
                .catch((ex) => {
                  console.log(ex);
                })
                .finally(() => {
                  navigation.goBack();
                });
            }}
          />
        </View>
      ),
    });
  }, [navigation]);

  const stepText = useDerivedValue(() => {
    const step = MIN + Math.ceil(Math.min(Math.max(0, x.value / STEP), MAX_RANGE - MIN));
    return `${step}%`;
  });

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
      ctx.offsetX = x.value;
    },
    onActive: (event, ctx) => {
      x.value = clamp(event.translationX + ctx.offsetX, 0, SLIDER_RANGE);
      // console.log(x.value);
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: theme.colors.accent,
      transform: [{ translateX: x.value }],
    };
  });

  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: x.value + KNOB_WIDTH / 2,
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
    };
  });

  return (
    <SafeAreaView style={{ padding: 16, alignItems: 'center' }}>
      <View style={{ padding: KNOB_WIDTH / 2 }}>
        <View
          style={[
            {
              width: SLIDER_WIDTH,
              height: BAR_HEIGHT,
              backgroundColor: theme.colors.onSurfaceLight,
              justifyContent: 'center',
              borderRadius: BAR_HEIGHT / 2,
            },
          ]}
        >
          <Animated.View
            style={[
              {
                height: BAR_HEIGHT,
                borderRadius: BAR_HEIGHT / 2,
                backgroundColor: theme.colors.accentLight,
                ...StyleSheet.absoluteFillObject,
              },
              animatedBarStyle,
            ]}
          />
          <PanGestureHandler onGestureEvent={eventHandler}>
            <Animated.View
              style={[
                {
                  width: KNOB_WIDTH,
                  height: KNOB_WIDTH,
                  borderRadius: KNOB_WIDTH / 2,
                  backgroundColor: 'red',
                },
                animatedStyle,
              ]}
            />
          </PanGestureHandler>
        </View>
        <Animated.View
          style={[
            {
              marginTop: Platform.OS === 'ios' ? KNOB_WIDTH / 2 : 0,
              width: KNOB_WIDTH,
              alignItems: 'center',
            },
            animatedText,
          ]}
        >
          <AnimatedText text={stepText} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SizeDropPercentScreen;
