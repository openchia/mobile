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
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, LogBox, StatusBar, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
  Provider as PaperProvider,
  useTheme,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilValueLoadable } from 'recoil';
import { currencyState, launcherIDsState, settingsState } from './recoil/Atoms';
import NetspaceScreen from './screens/charts/Netspace';
import ChiaPriceScreen from './screens/charts/ChiaPrice';
import PoolspaceScreen from './screens/charts/Poolspace';
import CurrencySelectionScreen from './screens/more/Currency';
import FarmerNameScreen from './screens/dashboard/FarmerName';
import LanguageSelectorScreen from './screens/more/Language';
import NewsPostScreen from './screens/news/Post';
import NewsScreen from './screens/News';
import ScanScreen from './screens/more/Scan';
import { DarkTheme, LightTheme } from './Theme';
import DashboardScreen from './screens/Dashboard';
import FarmerScreen from './screens/pool/Farmer';
import LaunchOptionScreen from './screens/more/Launch';
import MoreScreen from './screens/More';
import PoolScreen from './screens/Pool';
import FarmerSettingsScreen from './screens/dashboard/Settings';
import SettingComponentScreen from './screens/dashboard/settings/SettingComponent';
import DifficultyScreen from './screens/dashboard/settings/Difficulty';
import MinPayoutScreen from './screens/dashboard/settings/MinPayout';
import SizeDropPercentScreen from './screens/dashboard/settings/SizeDropPercent';
import SizeDropIntervalScreen from './screens/dashboard/settings/SizeDropInterval';
import FarmerPartialScreen from './screens/charts/Partials';
import CustomIconButton from './components/CustomIconButton';
// import i18n from './localization/i18n';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(['timer']);
LogBox.ignoreLogs(['keyboardDidShow: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['keyboardDidHide: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['cycle']);

const Root = ({ settings }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName={settings.intialRoute}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.tabNavigatorBackground },
        tabBarButton: (props) => <TouchableOpacity {...props} />,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabNavigatorBackground,
          borderTopColor: theme.colors.tabNavigatorTopBorderColor,
        },
        tabBarInactiveTintColor: theme.colors.textGreyLight,
        tabBarLabelStyle: {
          // fontFamily: theme.fonts.regular.fontFamily,
          //    fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={PoolScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
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
          title: t('news'),
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
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          headerShown: false,

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const BaseScreen = () => {
  const settingsLoadable = useRecoilValueLoadable(settingsState);
  const farmsLoadable = useRecoilValueLoadable(launcherIDsState);
  const currencyLoadable = useRecoilValueLoadable(currencyState);
  const { t, i18n } = useTranslation();

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    if (
      settingsLoadable.state === 'hasValue' &&
      farmsLoadable.state === 'hasValue' &&
      currencyLoadable.state === 'hasValue' &&
      i18n.isInitialized
    ) {
      SplashScreen.hide();
    }
  }, [settingsLoadable, farmsLoadable, currencyLoadable, i18n.isInitialized]);

  if (
    settingsLoadable.state === 'loading' ||
    farmsLoadable.state === 'loading' ||
    currencyLoadable.state === 'loading'
  ) {
    return null;
  }

  const theme = settingsLoadable.contents.isThemeDark ? DarkTheme : LightTheme;

  return (
    <ToastProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              <BottomSheetModalProvider>
                <StatusBar
                  backgroundColor={theme.colors.statusBarColor}
                  barStyle={
                    settingsLoadable.contents.isThemeDark ? 'light-content' : 'dark-content'
                  }
                />
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.tabNavigatorBackground },
                    headerBackTitleVisible: false,
                    gestureEnabled: true, // If you want to swipe back like iOS on Android
                    animation: 'slide_from_right',
                    tabBarItemStyle: { padding: 0 },
                  }}
                >
                  <Stack.Screen name="Root" options={{ headerShown: false }}>
                    {() => <Root theme={theme} settings={settingsLoadable.contents} />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="FarmerScreen"
                    component={FarmerScreen}
                    options={({ route }) => ({
                      headerShown: false,
                    })}
                  />
                  <Stack.Screen
                    name="Post"
                    component={NewsPostScreen}
                    options={() => ({
                      title: t('post'),
                    })}
                  />
                  <Stack.Screen
                    name="Language"
                    component={LanguageSelectorScreen}
                    options={() => ({
                      title: t('language'),
                      headerRight: () => (
                        <CustomIconButton
                          onPress={() => {
                            showDialog();
                          }}
                          icon={
                            <Ionicons
                              name="information-circle-outline"
                              size={30}
                              color={theme.colors.text}
                            />
                          }
                        />
                      ),
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
                      title: t('poolNetspaceChart'),
                    })}
                  />
                  <Stack.Screen
                    name="Netspace"
                    component={NetspaceScreen}
                    options={() => ({
                      title: t('netspaceChart'),
                    })}
                  />
                  <Stack.Screen
                    name="Chia Price Chart"
                    component={ChiaPriceScreen}
                    options={() => ({
                      title: t('priceChart'),
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
                    name="LaunchOptionScreen"
                    component={LaunchOptionScreen}
                    options={() => ({
                      title: t('launchScreen'),
                    })}
                  />
                  <Stack.Screen
                    name="Farmer Settings"
                    component={FarmerSettingsScreen}
                    options={() => ({
                      title: t('farmSettings'),
                    })}
                  />
                  <Stack.Screen
                    name="Settings Component"
                    component={SettingComponentScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  <Stack.Screen
                    name="Difficulty Setting"
                    component={DifficultyScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  <Stack.Screen
                    name="Min Payout Setting"
                    component={MinPayoutScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  <Stack.Screen
                    name="Size Drop Setting"
                    component={SizeDropPercentScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  <Stack.Screen
                    name="Size Drop Interval"
                    component={SizeDropIntervalScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  {/* <Stack.Screen
                    name="Farmer Partials Chart"
                    component={FarmerPartialScreen}
                    options={({ route }) => ({
                      title: t('farmerPartialsChart'),
                    })}
                  /> */}
                </Stack.Navigator>
                <Portal>
                  <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Translation still in English ?</Dialog.Title>
                    <Dialog.Content>
                      <Paragraph>
                        If so, we would appreciate the help in translating it. We use Crowdin for
                        our translations, allowing everyone to easily add their translations.
                      </Paragraph>
                      <Paragraph>
                        After the translation has been approved on our side it will be available in
                        the app.
                      </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={hideDialog}>No</Button>
                      <Button
                        onPress={() => {
                          hideDialog();
                          Linking.canOpenURL('https://crwd.in/openchia-mobile').then(
                            (supported) => {
                              if (supported) {
                                Linking.openURL('https://crwd.in/openchia-mobile');
                              }
                            }
                          );
                        }}
                      >
                        Yes
                      </Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              </BottomSheetModalProvider>
            </NavigationContainer>
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ToastProvider>
  );
};

export default BaseScreen;
