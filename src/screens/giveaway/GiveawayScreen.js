/* eslint-disable default-case */
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LoadingComponent from '../../components/LoadingComponent';
import GiveawayInfoSceen from './GiveawayInfoScreen';
import WinnersScreen from './WinnersScreen';
import CalculatorScreen from './CalculatorScreen';

const Tab = createMaterialBottomTabNavigator();

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

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: getHeaderTitle(route, t) });
  }, [navigation, route]);

  return (
    <Tab.Navigator
      labeled={false}
      activeColor={theme.colors.tabNavigatorText}
      barStyle={{ backgroundColor: theme.colors.tabNavigator }}
    >
      <Tab.Screen
        options={{
          style: {
            height: 45,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'ios-gift' : 'ios-gift-outline'} size={24} color={color} />
          ),
        }}
        name="Info"
      >
        {() => <GiveawayInfoSceen />}
      </Tab.Screen>
      <Tab.Screen
        options={{
          style: {
            backgroundColor: 'red',
            height: 45,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'ios-calculator' : 'ios-calculator-outline'}
              size={24}
              color={color}
            />
          ),
        }}
        name="Calculator"
      >
        {() => <CalculatorScreen />}
      </Tab.Screen>
      <Tab.Screen
        options={{
          style: {
            backgroundColor: 'red',
            height: 45,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'ios-trophy' : 'ios-trophy-outline'}
              size={24}
              color={color}
            />
          ),
        }}
        name="Winners"
      >
        {() => <WinnersScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default GiveawaySceen;
