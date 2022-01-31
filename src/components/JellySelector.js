/* eslint-disable no-plusplus */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import DropShadow from 'react-native-drop-shadow';
import CustomCard from './CustomCard';

const JellySelector = ({ items, onPress, defaultVal, width }) => {
  const SELECTION_WIDTH = width - 32;
  const BUTTON_WIDTH = (width - 32) / items.length;
  const transition = useSharedValue(0);
  const previous = useSharedValue(0);
  const current = useSharedValue(defaultVal || 0);
  const theme = useTheme();
  const { t } = useTranslation();

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(BUTTON_WIDTH * current.value) }],
  }));

  return (
    <DropShadow
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.05,
        // shadowOpacity: 1,
        shadowRadius: 3,
        // flex: 1,
        marginVertical: 8,
      }}
    >
      <CustomCard
        style={{
          marginVertical: 8,
          marginHorizontal: 8,
          borderRadius: 24,
          backgroundColor: theme.colors.onSurfaceLight,
        }}
      >
        <View
          style={{
            display: 'flex',
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: SELECTION_WIDTH,
            alignSelf: 'center',
            backgroundColor: theme.colors.onSurfaceLight,
            borderRadius: 24,
          }}
        >
          <View
            style={[StyleSheet.absoluteFill, { marginTop: 4, marginBottom: 4, marginStart: 4 }]}
          >
            <Animated.View
              style={[
                {
                  backgroundColor: theme.colors.accent,
                  ...StyleSheet.absoluteFillObject,
                  width: BUTTON_WIDTH - 6,
                  borderRadius: 24,
                },
                style,
              ]}
            />
          </View>
          {items.map((item, index) => (
            <TouchableWithoutFeedback
              key={item.label}
              onPress={() => {
                previous.value = current.value;
                transition.value = 0;
                current.value = index;
                transition.value = withTiming(1);
                onPress(item, index);
              }}
              style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
            >
              <Animated.View
                style={{ padding: 8, paddingTop: 12, paddingBottom: 12, width: BUTTON_WIDTH }}
              >
                <Text
                  style={{
                    color: theme.colors.jellyBarText,
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}
                >
                  {t(`${item.label}`)}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </CustomCard>
    </DropShadow>
  );
};

export default JellySelector;
