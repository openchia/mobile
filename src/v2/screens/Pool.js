import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlocksFoundScreen from '../../screens/BlocksFoundScreen';
import FarmersScreen from '../../screens/FarmersScreen';
import PayoutScreen from '../../screens/PayoutScreen';
import OpenChiaIconWithText from '../../images/OpenChiaIconWithText';
import StatsScreen from '../../screens/StatsScreen';
import { useTheme } from 'react-native-paper';
import IconButton from '../../components/IconButton';

const Tab = createMaterialTopTabNavigator();

const StatsToolbar = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        height: 54,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        // width: '50%',
        alignItems: 'center',
        // padding: 8,
      }}
    >
      <OpenChiaIconWithText
        style={{ marginLeft: 8, width: 200, height: 36 }}
        color={theme.colors.primary}
      />
      {/* <View style={{ flex: 1 }} /> */}
      <IconButton icon={<Ionicons name="search" size={24} color="black" />}></IconButton>
    </View>
  );
};

const PoolScreen = () => {
  const x = 0;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatsToolbar />
      <Tab.Navigator>
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Farmers" component={FarmersScreen} />
        <Tab.Screen name="Blocks" component={BlocksFoundScreen} />
        <Tab.Screen name="Payouts" component={PayoutScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default PoolScreen;
