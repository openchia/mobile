/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { LogBox, StatusBar, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRecoilValue } from 'recoil';
import { initialRouteState, launcherIDsState, settingsState } from './Atoms';
import OpenChiaIcon from './images/OpenChiaIcon';
import ChiaPriceScreen from './screens/charts/ChiaPriceScreen';
import PoolspaceScreen from './screens/charts/PoolspaceScreen';
import CurrencySelectionScreen from './screens/CurrencySelectionScreen';
import FarmerNameScreen from './screens/farmer/FarmerNameScreen';
import FarmerNotificationScreen from './screens/farmer/FarmerNotificationScreen';
import FarmerSettingsScreen from './screens/farmer/FarmerSettingsScreen';
import FarmerTestScreen, { getHeaderTitle } from './screens/farmer/FarmerTestScreen';
import CreateGroupScreen from './screens/groups/CreateGroupScreen';
import LanguageSelectorScreen from './screens/LanguageSelectorScreen';
import NewsPostScreen from './screens/NewsPostScreen';
import NewsScreen from './screens/NewsScreen';
import ScanScreen from './screens/ScanScreen';
import SettingsScreen from './screens/SettingsScreen';
import { DarkTheme, LightTheme } from './Theme';
import DashboardScreen from './v2/screens/Dashboard';
import MoreScreen from './v2/screens/More';
import PoolScreen from './v2/screens/Pool';
import GiveawaySceen from './screens/giveaway/GiveawayScreen';
// import { enableFreeze } from 'react-native-screens';

// enableFreeze(true);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();
// const Tab = createMaterialBottomTabNavigator();

// LogBox.ignoreLogs(['Reanimated 2']);
LogBox.ignoreLogs(['timer']);
LogBox.ignoreLogs(['keyboardDidShow: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['keyboardDidHide: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['cycle']);

const Root = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.tabNavigatorBackground },
        tabBarButton: (props) => <TouchableOpacity {...props} />,
        tabBarItemStyle: {
          padding: 2,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
        tabBarStyle: {
          height: 56,
          backgroundColor: theme.colors.tabNavigatorBackground,
          borderTopColor: theme.colors.tabNavigatorTopBorderColor,
        },
        tabBarInactiveTintColor: theme.colors.textGreyLight,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.regular.fontFamily,
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Pool"
        component={PoolScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
            // <OpenChiaIcon size={size} color={color} />
            // <MaterialCommunityIcons name="pool" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'ios-newspaper' : 'ios-newspaper-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* <Tab.Screen
      name="Giveaway"
      component={GiveawayScreen}
      options={{
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? 'gift' : 'gift-outline'}
            size={size}/
            color={color}
          />
        ),
      }}
    /> */}
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          headerShown: true,

          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="read-more" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const BaseScreen = () => {
  const settings = useRecoilValue(settingsState);
  const launcherIDs = useRecoilValue(launcherIDsState);
  const initialRoute = useRecoilValue(initialRouteState);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));
  // const launcherIDsArray =launcherIDs;

  const theme = settings.isThemeDark ? DarkTheme : LightTheme;
  const { t } = useTranslation();

  return (
    <ToastProvider>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              <StatusBar
                backgroundColor={theme.colors.statusBarColor}
                // barStyle="light-content"
                barStyle={
                  // Platform.OS === 'ios'
                  settings.isThemeDark ? 'light-content' : 'dark-content'
                  // : 'light-content'
                }
              />
              {/* <View style={{ height: 54, backgroundColor: 'red' }}></View> */}
              <Stack.Navigator
                screenOptions={{
                  // headerShown: true,
                  // headerStyle: { backgroundColor: theme.colors.primary },
                  headerStyle: { backgroundColor: theme.colors.tabNavigatorBackground },
                  // headerTintColor: theme.colors.textGreyLight,
                  // drawerStyle: { backgroundColor: theme.colors.primary },
                  headerBackTitleVisible: false,
                  gestureEnabled: true, // If you want to swipe back like iOS on Android
                  animation: 'slide_from_right',
                  // ...TransitionPresets.SlideFromRightIOS,
                }}
              >
                <Stack.Screen name="Root" options={{ headerShown: false }}>
                  {() => (
                    <Root
                      theme={theme}
                      // toggleTheme={toggleTheme}
                      // launcherIDs={launcherIDs}
                      // initialRoute={initialRoute}
                      // t={t}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="Farmer"
                  component={FarmerTestScreen}
                  options={({ route }) => ({
                    // title: getHeaderTitle(route, t),
                    title: getHeaderTitle(route, t),
                    // headerRight: () => (
                    //   <Button onPress={() => alert('This is a button!')} title="Info" color="#fff" />
                    // ),
                  })}
                  // options={({ route, navigation }) => ({})}
                />
                <Stack.Screen
                  name="Post"
                  component={NewsPostScreen}
                  options={() => ({
                    title: t('post'),
                  })}
                />
                <Stack.Screen
                  name="Farmer Settings"
                  component={FarmerSettingsScreen}
                  options={() => ({
                    title: t('farmerSettings'),
                  })}
                />
                <Stack.Screen
                  name="Language"
                  component={LanguageSelectorScreen}
                  options={() => ({
                    title: t('language'),
                  })}
                />
                <Stack.Screen
                  name="Currency"
                  component={CurrencySelectionScreen}
                  options={() => ({
                    title: t('currency'),
                  })}
                />
                <Stack.Screen
                  name="Poolspace"
                  component={PoolspaceScreen}
                  options={() => ({
                    title: t('poolSpace'),
                  })}
                />
                <Stack.Screen
                  name="Chia Price Chart"
                  component={ChiaPriceScreen}
                  options={() => ({
                    title: t('chiaPriceChart'),
                  })}
                />
                <Stack.Screen
                  name="Farmer Name"
                  component={FarmerNameScreen}
                  options={() => ({
                    title: t('farmName'),
                  })}
                />
                <Stack.Screen
                  name="Verify Farm"
                  component={ScanScreen}
                  options={() => ({
                    title: t('verifyFarm'),
                  })}
                />
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={() => ({
                    title: t('settings'),
                  })}
                />
                <Stack.Screen
                  name="Farmer Notifications"
                  component={FarmerNotificationScreen}
                  options={() => ({
                    title: t('farmerNotifications'),
                  })}
                />
                <Stack.Screen
                  name="Create Group"
                  component={CreateGroupScreen}
                  options={() => ({
                    title: t('createGroup'),
                  })}
                />
                <Stack.Screen
                  name="Giveaway"
                  component={GiveawaySceen}
                  options={() => ({
                    title: t('giveaway'),
                  })}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ToastProvider>
  );
};

export default BaseScreen;
