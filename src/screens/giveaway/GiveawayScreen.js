/* eslint-disable default-case */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import CalculatorScreen from './CalculatorScreen';
import GiveawayInfoSceen from './GiveawayInfoScreen';
import WinnersScreen from './WinnersScreen';

const Tab = createMaterialTopTabNavigator();

export const getHeaderTitle = (route, t, name) => {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Giveaway Info';
  // name={t('stats')}

  switch (routeName) {
    case 'Giveaway Info':
      return `${t('giveaway')}`;
    case 'Calculator':
      return `${t('ticketsCalculator')}`;
    case 'Winners':
      return `${t('winners')}`;
  }
};

const GiveawaySceen = ({ route, navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: theme.fonts.regular.fontFamily,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.tabNavigatorBackground,
        },
      }}
    >
      <Tab.Screen name="Info">{() => <GiveawayInfoSceen />}</Tab.Screen>
      <Tab.Screen name="Calculator">{() => <CalculatorScreen />}</Tab.Screen>
      <Tab.Screen name="Winners">{() => <WinnersScreen />}</Tab.Screen>
    </Tab.Navigator>
  );
};

export default GiveawaySceen;
