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
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import merge from 'deepmerge';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, LogBox, StatusBar, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Button,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currencyState,
  farmerSearchBarPressedState,
  farmerSearchBarTextState,
  groupState,
  initialRouteState,
  launcherIDsState,
  settingsState,
} from './Atoms';
import CustomDrawerContent from './components/CustomDrawerContent';
import BlocksFoundScreen from './screens/BlocksFoundScreen';
import ChiaPriceScreen from './screens/charts/ChiaPriceScreen';
import PoolspaceScreen from './screens/charts/PoolspaceScreen';
import CurrencySelectionScreen from './screens/CurrencySelectionScreen';
import FarmerNameScreen from './screens/farmer/FarmerNameScreen';
import FarmerNotificationScreen from './screens/farmer/FarmerNotificationScreen';
import FarmerSettingsScreen from './screens/farmer/FarmerSettingsScreen';
import FarmersScreen from './screens/FarmersScreen';
import GiveawaySceen from './screens/giveaway/GiveawayScreen';
import GroupScreen from './screens/groups/GroupScreen';
import HomeScreen from './screens/HomeScreen';
import LanguageSelectorScreen from './screens/LanguageSelectorScreen';
import NewsPostScreen from './screens/NewsPostScreen';
import NewsScreen from './screens/NewsScreen';
import PayoutScreen from './screens/PayoutScreen';
import ScanScreen from './screens/ScanScreen';
import SettingsScreen from './screens/SettingsScreen';
import StatsScreen from './screens/StatsScreen';
import CreateGroupScreen from './screens/groups/CreateGroupScreen';
import FarmerTestScreen, { getHeaderTitle } from './screens/farmer/FarmerTestScreen';

// LogBox.ignoreLogs(['Reanimated 2']);
LogBox.ignoreLogs(['timer']);
LogBox.ignoreLogs(['keyboardDidShow: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['keyboardDidHide: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['cycle']);

const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const LightTheme = {
  ...CombinedDefaultTheme,
  roundness: 2,
  colors: {
    ...CombinedDefaultTheme.colors,
    background: '#ebebeb',
    border: '#436B34',
    accent: '#c57e49',
    surface: '#f5f5f5',
    onSurface: '#fff',
    primary: '#436B34',
    primaryLight: '#69A951',
    primaryDark: '#243F1E',
    accentColor: '#4B4E97',
    // textPrimary: '#fff',
    // textSecondary: '#436B34',
    divider: 'rgba(0, 0, 0, 0.4)',
    selected: 'rgba(0, 0, 0, 0.2)',
    statusBarColor: '#436B34',
    // statusBarColor: '#243F1E',
    text: '#636363',
    textLight: '#436B34',
    textDark: '#243F1E',
    textGrey: '#8c8c8c',
    drawerText: '#636363',
    textGreyLight: '#8c8c8c',
    // disabled: '#436B34',
    placeholder: '#8c8c8c',
    // backdrop: '#436B34',
    notification: '#436B34',
    leaves: 'rgba(41, 50, 57, 0.05)',
    // borderColor: 'rgba(0,0,0,0.08)',
    borderColor: '#e0e0e0',
    tabNavigator: '#436B34',
    tabNavigatorText: '#f5f5f5',
    jellyBarText: '#424242',
    drawerSelected: '#436B34',
  },
};

const DarkTheme = {
  ...CombinedDarkTheme,
  roundness: 2,
  colors: {
    ...CombinedDarkTheme.colors,
    background: '#212428',
    // text: '#ffffff',
    text: '#ffffff',
    textLight: '#61914e',
    textDark: '#243F1E',
    textGrey: '#bababa',
    drawerText: '#bababa',
    textGreyLight: '#8c8c8c',
    accentColor: '#f5f5f5',
    surface: '#212428',
    accent: '#c57e49',
    onSurface: '#33373d',
    primary: '#436B34',
    primaryLight: '#588746',
    primaryDark: '#243F1E',
    statusBarColor: '#243F1E',
    leaves: 'rgba(245, 245, 245, 0.07)',
    divider: 'rgba(255, 255, 255, 0.2)',
    selected: 'rgba(255, 255, 255, 0.2)',
    // disabled: '#f5f5f5',
    placeholder: '#bababa',
    enabled: 'pink',
    // backdrop: '#f5f5f5',
    notification: '#f5f5f5',
    borderColor: 'rgba(0,0,0,0.05)',
    tabNavigator: '#436B34',
    tabNavigatorText: '#f5f5f5',
    jellyBarText: '#f5f5f5',
    drawerSelected: '#61914e',
  },
};

const Root = ({ theme, toggleTheme, launcherIDsArray, initialRoute, t }) => {
  // const [searching, setSearching] = useState(false);
  const [text, setText] = useRecoilState(farmerSearchBarTextState);
  const setPressedSearch = useSetRecoilState(farmerSearchBarPressedState);
  const width = useSharedValue(48);
  const searching = useSharedValue(false);
  const pressed = useSharedValue(false);
  // const textShowing = useSharedValue(false);
  const [textShowing, setTextShowing] = useState(false);
  const focus = useSharedValue(false);
  const input = useRef(null);
  const [groups, setGroups] = useRecoilState(groupState);

  const fullWidth = Dimensions.get('window').width;

  const recordResult = (result) => {
    input.current.focus();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      display: pressed.value ? 'flex' : 'none',
      width: withTiming(
        width.value,
        {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        (isFinished) => {
          if (isFinished && width.value === fullWidth) {
            searching.value = true;
            runOnJS(recordResult)(searching.value);
            // input.current.focus();
          } else {
            searching.value = false;
            pressed.value = false;
          }
        }
      ),
    };
  });

  const showStyle = useAnimatedStyle(() => {
    return {
      display: pressed.value ? 'none' : 'flex',
      // visible: searching.value,
    };
  });

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          launcherIDsArray={launcherIDsArray}
          toggleTheme={toggleTheme}
        />
      )}
      backBehavior="history"
      initialRouteName={initialRoute.name}
      // useLegacyImplementation
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        // drawerActiveTintColor: theme.colors.text,
        drawerActiveTintColor: 'black',
        headerTintColor: '#fff',
        inactiveTintColor: 'black',
        activeBackgroundColor: 'grey',
        navigationOptions: {
          headerBackTitle: 'Back',
        },
        // inactiveTintColor: 'blue',
        inactiveBackgroundColor: 'white',
        labelStyle: {
          marginLeft: 5,
        },
        // drawerActiveBackgroundColor: { background: 'red' },
        // drawerContentContainerStyle: { backgroundColor: 'red' },
        // labelStyle: { color: 'black' }
        drawerStyle: { backgroundColor: theme.colors.surface },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        // options={({ route }) => ({
        //   title: 'Test',
        // })}
      />
      <Drawer.Screen
        name="News"
        component={NewsScreen}
        options={() => ({
          title: t('news'),
        })}
      />
      <Drawer.Screen
        name="Stats"
        component={StatsScreen}
        options={() => ({
          title: t('stats'),
        })}
      />
      <Drawer.Screen
        name="Group"
        component={GroupScreen}
        options={() => ({
          title: t('groups'),
        })}
      />
      <Drawer.Screen
        name="Farmers"
        component={FarmersScreen}
        options={() => ({
          title: t('farmers'),
          headerRightContainerStyle: {
            position: searching.value ? 'absolute' : 'relative',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1,
          },
          headerRight: () => (
            <View style={{ backgroundColor: 'transparent' }}>
              <Animated.View
                style={[
                  {
                    backgroundColor: theme.colors.primary,
                    width: '100%',
                  },1
                ]}
              >
                <Animated.View style={[showStyle, { display: 'flex', flexDirection: 'row' }]}>
                  <CustomIconButton
                    icon={<Ionicons name="ios-search-sharp" size={24} color="white" />}
                    onPress={() => {
                      width.value = fullWidth;
                      pressed.value = true;
                    }}
                    title="Info"
                    color="#fff"
                  />
                </Animated.View>
                <Animated.View style={[animatedStyle, { flexDirection: 'row', display: 'none' }]}>
                  <CustomIconButton
                    icon={<Ionicons name="arrow-back" size={24} color="white" />}
                    onPress={() => {
                      width.value = 48;
                      setText('');
                      input.current.blur();
                    }}
                    title="Info"
                    color="#fff"
                  />
                  <TextInput
                    // autoFocus
                    ref={input}
                    style={{
                      backgroundColor: theme.colors.primary,
                      flex: 1,
                      color: '#ffffff',
                    }}
                    underlineColorAndroid="transparent"
                    value={text}
                    placeholder="Search..."
                    placeholderTextColor="#bababa"
                    onChangeText={(text) => {
                      setTextShowing(text.length > 0);
                      setText(text);
                    }}
                  />
                  {textShowing && (
                    <Animated.View
                    // entering={ZoomIn.duration(100)}
                    // exiting={ZoomOut.duration(100)}
                    >
                      <CustomIconButton
                        icon={<Ionicons name="close" size={24} color="white" />}
                        onPress={() => {
                          setText('');
                          setTextShowing(false);
                          setPressedSearch(true);
                        }}
                        title="Info"
                        color="#fff"
                      />
                    </Animated.View>
                  )}
                  <CustomIconButton
                    icon={<Ionicons name="ios-search-sharp" size={24} color="white" />}
                    onPress={() => {
                      input.current.blur();
                      setPressedSearch(true);
                    }}
                    title="Info"
                    color="#fff"
                  />
                </Animated.View>
              </Animated.View>
            </View>
          ),
        })}
      />
      <Drawer.Screen
        name="Blocks Found"
        component={BlocksFoundScreen}
        options={() => ({
          title: t('blocksFound'),
        })}
      />
      <Drawer.Screen
        name="Payouts"
        component={PayoutScreen}
        options={() => ({
          title: t('payouts'),
        })}
      />
      <Drawer.Screen
        name="Giveaway"
        component={GiveawaySceen}
        options={() => ({
          title: t('giveaway'),
        })}
      />
      {/* <Drawer.Screen
        name="Farmer Details Drawer"
        component={FarmerTestScreen}
        options={({ route }) => ({
          title: getHeaderTitle(route, t),
          headerRight: () => (
            <Button onPress={() => alert('This is a button!')} title="Info" color="#fff" />
          ),
        })}
      /> */}
      <Drawer.Screen
        name="Farmer Group"
        component={FarmerTestScreen}
        options={() => ({
          title: t('createGroup'),
        })}
      />
      <Drawer.Screen
        name="Farmer Drawer"
        component={FarmerTestScreen}
        options={({ route }) => ({
          title: getHeaderTitle(route, t),
          // title: t('createGroup'),
        })}
      />
      {launcherIDsArray.map((item) => (
        <Drawer.Screen
          key={item.name}
          name={item.name ? item.name : item.value.name}
          component={FarmerTestScreen}
        />
      ))}
    </Drawer.Navigator>
  );
};

const AppRoot = ({ theme, toggleTheme, launcherIDsArray, isThemeDark, initialRoute }) => {
  const { t } = useTranslation();
  return (
    // const isDrawerOpen = useDrawerStatus() === 'open';
    <NavigationContainer theme={theme}>
      <StatusBar
        backgroundColor={theme.colors.statusBarColor}
        barStyle="light-content"
        // barStyle={
        //   Platform.OS === 'ios' ? (isThemeDark ? 'light-content' : 'dark-content') : 'light-content'
        // }
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: theme.colors.primary },
          headerBackTitleVisible: false,
          gestureEnabled: true, // If you want to swipe back like iOS on Android
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Root" options={{ headerShown: false }}>
          {() => (
            <Root
              theme={theme}
              toggleTheme={toggleTheme}
              launcherIDsArray={launcherIDsArray}
              initialRoute={initialRoute}
              t={t}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const ApplicationNavigator = () => {
  const settings = useRecoilValue(settingsState);
  const launcherIDs = useRecoilValue(launcherIDsState);
  const initialRoute = useRecoilValue(initialRouteState);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));
  const theme = settings.isThemeDark ? DarkTheme : LightTheme;

  return (
    <ToastProvider>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={theme}>
            <AppRoot
              theme={theme}
              launcherIDsArray={launcherIDsArray}
              isThemeDark={settings.isThemeDark}
              initialRoute={initialRoute}
            />
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ToastProvider>
  );
};

export default ApplicationNavigator;
