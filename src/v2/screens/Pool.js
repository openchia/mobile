import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconButton from '../../components/IconButton';
import OpenChiaTextIconRight from '../../images/OpenChiaTextIconRight';
import BlocksFoundScreen from '../../screens/BlocksFoundScreen';
import FarmersScreen from '../../screens/FarmersScreen';
import PayoutScreen from '../../screens/PayoutScreen';
import StatsScreen from '../../screens/StatsScreen';

const Tab = createMaterialTopTabNavigator();

const StatsToolbar = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        height: 54,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        backgroundColor: 'white',
        // width: '50%',
        paddingTop: 6,
        paddingBottom: 6,
        paddingStart: 8,
        alignItems: 'center',
        // justifyContent: 'center',
        // padding: 8,
      }}
    >
      <OpenChiaTextIconRight
        style={{ marginLeft: 8, marginRight: 16, width: 200, height: 36 }}
        // size={}
        color={theme.colors.primary}
      />
      {/* <Text
        style={{
          fontSize: 24,
          color: theme.colors.primary,
          // fontWeight: 'bold',
          flex: 1,
          // textAlignVertical: 'center',
          fontFamily: theme.fonts.bold.fontFamily,
        }}
      >
        OpenChia
      </Text> */}
      <View style={{ flex: 1 }} />
      <IconButton
        icon={<Ionicons name="search" size={24} color={theme.colors.textGreyLight} />}
      ></IconButton>
    </View>
  );
};

const PoolScreen = () => {
  const theme = useTheme();
  const x = 0;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatsToolbar />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: theme.fonts.regular.fontFamily,
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
