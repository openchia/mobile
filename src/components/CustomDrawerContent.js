/* eslint-disable react/jsx-props-no-spreading */
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, View, Image, SafeAreaView, Platform } from 'react-native';
import { Divider, Drawer, Switch, Text, TouchableRipple, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwsomeIcons from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import CustomDrawerSection from './CustomDrawerSection';
import ThemeContext from '../contexts/ThemeContext';
import { getFarmer } from '../Api';
import { themeState } from '../Atoms';
import OpenChiaIcon from '../images/OpenChiaIcon';
import OpenChiaIconWithText from '../images/OpenChiaIconWithText';

const CustomDrawerContent = (props) => {
  const { navigation, launcherIDsArray } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  const [isThemeDark, setIsThemeDark] = useRecoilState(themeState);

  const toggleTheme = () => {
    setIsThemeDark(!isThemeDark);
  };

  const font = theme.fonts.medium;
  //   console.log(launcherIDsArray);
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: isThemeDark ? theme.colors.primary : theme.colors.primary,
      }}
    >
      <View
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: isThemeDark ? theme.colors.primary : theme.colors.primary,
          paddingTop: Platform.OS === 'ios' ? 48 : 0,
          paddingLeft: 12,
          height: Platform.OS === 'ios' ? 110 : 72,
        }}
      >
        <OpenChiaIconWithText style={{ width: '100%', height: 36 }} color="#f5f5f5" />
      </View>
      {/* <Divider style={{ backgroundColor: theme.colors.divider }} /> */}
      <DrawerContentScrollView
        contentContainerStyle={{
          paddingTop: 0,
          // backgroundColor: isThemeDark ? theme.colors.primary : theme.colors.primary,
        }}
        {...props}
      >
        {/* <View
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 12,
            height: 72,
          }}
        >
          <OpenChiaIconWithText style={{ width: '100%', height: 36 }} color="#f5f5f5" />
        </View> */}
        <CustomDrawerSection>
          <DrawerItem
            label={t('navigate:home')}
            onPress={() => navigation.navigate('Home')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="home-outline"
                size={size}
                color={theme.colors.textGrey}
              />
            )}
          />
          <DrawerItem
            label={t('navigate:stats')}
            onPress={() => navigation.navigate('Stats')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="finance" size={size} color={theme.colors.textGrey} />
            )}
          />
          <DrawerItem
            label="Charts"
            onPress={() => navigation.navigate('Charts')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-areaspline"
                size={size}
                color={theme.colors.textGrey}
              />
            )}
          />
          <DrawerItem
            label={t('navigate:farmers')}
            onPress={() => navigation.navigate('Farmers')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="silo" size={size} color={theme.colors.textGrey} />
            )}
          />
          <DrawerItem
            label={t('navigate:blocksFound')}
            onPress={() => navigation.navigate('Blocks Found')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="shape-square-plus"
                size={size}
                color={theme.colors.textGrey}
              />
            )}
          />
          <DrawerItem
            label={t('navigate:payouts')}
            onPress={() => navigation.navigate('Payouts')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="cash-multiple"
                size={size}
                color={theme.colors.textGrey}
              />
            )}
          />
        </CustomDrawerSection>
        <CustomDrawerSection title="Launcher ID's">
          {launcherIDsArray.map((item) => (
            <DrawerItem
              labelStyle={{ color: theme.colors.textGrey }}
              key={item.name}
              label={item.value ? item.value : item.name}
              onPress={() => {
                navigation.navigate({ name: 'Farmer Details', params: { launcherId: item.name } });
                // getFarmer(item.name)
                //   .then((data) => {
                //     navigation.navigate({ name: 'Farmer Details', params: { item: data } });
                //   })
                //   .catch((error) => console.log(error));
              }}
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="silo" size={size} color={theme.colors.textGrey} />
              )}
            />
          ))}
          <DrawerItem
            label={t('navigate:launcherID')}
            onPress={() => navigation.navigate('Scan Launcher ID')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="plus" size={size} color={theme.colors.textGrey} />
            )}
          />
        </CustomDrawerSection>
        <CustomDrawerSection label="Preferences">
          <TouchableRipple onPress={() => toggleTheme()}>
            <View style={styles.preference}>
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={24}
                color={theme.colors.textGrey}
              />
              <Text style={{ color: theme.colors.textGrey, flex: 1, marginStart: 32 }}>
                {t('navigate:darkMode')}
              </Text>
              <View pointerEvents="none">
                <Switch value={isThemeDark} />
              </View>
            </View>
          </TouchableRipple>
          {/* <DrawerItem
            label="Dark Theme"
            onPress={() => navigation.navigate('Home')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={theme.colors.textGrey} />
            )}
          /> */}
        </CustomDrawerSection>
        <CustomDrawerSection showDivider={false}>
          <DrawerItem
            label={t('navigate:settings')}
            onPress={() => navigation.navigate('Settings')}
            labelStyle={{ color: theme.colors.textGrey }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={theme.colors.textGrey} />
            )}
          />
        </CustomDrawerSection>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  preference: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default CustomDrawerContent;
