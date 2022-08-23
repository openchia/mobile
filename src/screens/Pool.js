import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import SafeAreaView from 'react-native-safe-area-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import OpenChiaTextIconRight from '../assets/svgs/OpenChiaTextIconRight';
import CustomIconButton from '../components/CustomIconButton';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import {
  farmerSearchBarPressedState,
  farmerSearchBarTextState,
  settingsState,
} from '../recoil/Atoms';
import BlocksFoundScreen from './pool/Blocks';
import FarmersScreen from './pool/Farmers';
import PayoutScreen from './pool/Payouts';
import StatsScreen from './pool/Stats';

const Tab = createMaterialTopTabNavigator();

const StatsToolbar = ({ route, showSearch }) => {
  const [searching, setSearching] = useState(false);
  const [text, setText] = useRecoilState(farmerSearchBarTextState);
  const setPressedSearch = useSetRecoilState(farmerSearchBarPressedState);
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Stats';

  useEffect(() => {
    if (routeName !== 'Farmers') {
      if (searching) {
        setSearching(false);
        setText('');
      }
    }
  }, [routeName]);

  const theme = useTheme();
  return (
    <View
      style={{
        height: 54,
        flexDirection: 'row',
        paddingTop: 6,
        paddingBottom: 6,
        alignItems: 'center',
        backgroundColor: theme.colors.tabNavigatorBackground,
      }}
    >
      {searching ? (
        <>
          <CustomIconButton
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.textGreyLight} />}
            onPress={() => {
              setSearching(false);
              setText('');
            }}
            title="Info"
            color="#fff"
          />
          <TextInput
            style={{
              backgroundColor: theme.colors.tabNavigatorBackground,
              flex: 1,
              color: '#ffffff',
            }}
            underlineColorAndroid="transparent"
            value={text}
            placeholder="Search..."
            placeholderTextColor="#bababa"
            onChangeText={(text) => {
              setText(text);
            }}
          />
          {text !== '' && (
            <CustomIconButton
              icon={<Ionicons name="close" size={24} color={theme.colors.textGreyLight} />}
              onPress={() => {
                setText('');
                setPressedSearch(true);
              }}
              title="Info"
              color="#fff"
            />
          )}
          <CustomIconButton
            icon={
              <Ionicons
                name="search"
                size={24}
                color={theme.colors.textGreyLight}
                onPress={() => {
                  setPressedSearch(true);
                }}
              />
            }
          />
        </>
      ) : (
        <>
          <OpenChiaTextIconRight
            style={{ paddingStart: 8, marginLeft: 12, marginRight: 16, width: 200, height: 32 }}
            color={theme.colors.primary}
          />
          <View style={{ flex: 1 }} />
          {routeName === 'Farmers' && (
            <CustomIconButton
              icon={
                <Ionicons
                  name="search"
                  size={24}
                  color={theme.colors.textGreyLight}
                  onPress={() => {
                    setSearching(true);
                  }}
                />
              }
            />
          )}
        </>
      )}
    </View>
  );
};

const PoolScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const settings = useRecoilValue(settingsState);
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.statusBarColor }}>
      <FocusAwareStatusBar
        backgroundColor={theme.colors.statusBarColor}
        barStyle={settings.isThemeDark ? 'light-content' : 'dark-content'}
      />
      <StatsToolbar route={route} showSearch={showSearch} />
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarLabelStyle: {
            fontFamily: theme.fonts.regular.fontFamily,
            textTransform: 'none',
          },
          tabBarItemStyle: { padding: 0 },
          tabBarStyle: {
            backgroundColor: theme.colors.tabNavigatorBackground,
          },
          tabBarOptions: { upperCaseLabel: false },
        }}
      >
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={() => ({
            title: t('stats'),
          })}
        />
        <Tab.Screen
          name="Farmers"
          component={FarmersScreen}
          options={() => ({
            title: t('farmers'),
          })}
        />
        <Tab.Screen
          name="Blocks"
          component={BlocksFoundScreen}
          options={() => ({
            title: t('blocks'),
          })}
        />
        <Tab.Screen
          name="Payouts"
          component={PayoutScreen}
          options={() => ({
            title: t('payouts'),
          })}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default PoolScreen;
