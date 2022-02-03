import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { farmerSearchBarPressedState, farmerSearchBarTextState } from '../../Atoms';
import CustomIconButton from '../../components/CustomIconButton';
import CustomStatusBar from '../../components/CustomStatusBar';
import OpenChiaTextIconRight from '../../images/OpenChiaTextIconRight';
import BlocksFoundScreen from '../../screens/BlocksFoundScreen';
import FarmersScreen from '../../screens/FarmersScreen';
import PayoutScreen from '../../screens/PayoutScreen';
import StatsScreen from '../../screens/StatsScreen';

const Tab = createMaterialTopTabNavigator();

const StatsToolbar = ({ showSearch }) => {
  const [searching, setSearching] = useState(false);
  const [text, setText] = useRecoilState(farmerSearchBarTextState);
  const setPressedSearch = useSetRecoilState(farmerSearchBarPressedState);
  // const routeName = getFocusedRouteNameFromRoute(route) ?? 'Stats';

  // console.log(routeName);
  const theme = useTheme();
  return (
    <View
      style={{
        height: 54,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // backgroundColor: 'white',
        // width: '50%',
        paddingTop: 6,
        paddingBottom: 6,
        alignItems: 'center',
        backgroundColor: theme.colors.tabNavigatorBackground,
        // justifyContent: 'center',
        // padding: 8,
      }}
    >
      {searching ? (
        <>
          <CustomIconButton
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.textGreyLight} />}
            onPress={() => {
              setSearching(false);
              // width.value = 48;
              setText('');
              // input.current.blur();
            }}
            title="Info"
            color="#fff"
          />
          <TextInput
            style={{
              // width: '100%',
              backgroundColor: theme.colors.onSurface,
              flex: 1,
              color: '#ffffff',
            }}
            underlineColorAndroid="transparent"
            value={text}
            placeholder="Search..."
            placeholderTextColor="#bababa"
            onChangeText={(text) => {
              // setTextShowing(text.length > 0);
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
            // size={}
            color={theme.colors.primary}
          />
          <View style={{ flex: 1 }} />
          {showSearch && (
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

  // useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route) ?? 'Stats';
  //   setShowSearch(routeName === 'Farmers');
  // }, [navigation, route]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View style={{ flex: 1, backgroundColor: theme.colors.primary }}></View> */}
      <CustomStatusBar />
      <StatsToolbar showSearch={showSearch} />
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarLabelStyle: {
            fontFamily: theme.fonts.regular.fontFamily,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.tabNavigatorBackground,
          },
        }}
      >
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Farmers" component={FarmersScreen} />
        <Tab.Screen name="Blocks" component={BlocksFoundScreen} />
        <Tab.Screen name="Payouts" component={PayoutScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default PoolScreen;
