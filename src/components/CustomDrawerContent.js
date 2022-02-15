/* eslint-disable react/jsx-props-no-spreading */
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { Switch, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRecoilState, useSetRecoilState } from 'recoil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateFCMToken } from '../Api';
import {  settingsState, groupState } from '../Atoms';
import OpenChiaIconWithText from '../images/OpenChiaIconWithText';
import { getObject } from '../utils/Utils';
import CustomDrawerSection from './CustomDrawerSection';
import ChiaIcon from '../images/ChiaIcon';
import ChiaIconVerified from '../images/ChiaIconVerified';

const CustomDrawerContent = (props) => {
  const { navigation, launcherIDsArray } = props;
  const theme = useTheme();
  const { roundness } = theme;
  const { t } = useTranslation();

  const [settings, setSettings] = useRecoilState(settingsState);
  const [groups, setGroups] = useRecoilState(groupState);

  const onPress = (location, saveroute) => {
    navigation.navigate('Root', { screen: location, intial: false });
    if (saveroute) {
    // setIntialRoute({ name: location });
    }
  };

  const Icon = ({ selected, size, iconName, iconNameSelected }) => {
    if (selected)
      return (
        <Ionicons
          name={iconNameSelected}
          size={size}
          color={selected ? theme.colors.drawerSelected : theme.colors.drawerText}
        />
      );
    return (
      <Ionicons
        name={iconName}
        size={size}
        color={selected ? theme.colors.drawerSelected : theme.colors.drawerText}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: settings.isThemeDark ? theme.colors.primary : theme.colors.primary,
          paddingTop: Platform.OS === 'ios' ? 48 : 0,
          paddingLeft: 12,
          height: Platform.OS === 'ios' ? 120 : 72,
        }}
      >
        <OpenChiaIconWithText style={{ width: '100%', height: 36 }} color="#f5f5f5" />
      </View>
      <DrawerContentScrollView
        contentContainerStyle={{
          paddingTop: 0,
        }}
        {...props}
      >
        <CustomDrawerSection style={{ backgroundColor: theme.colors.background }}>
          <DrawerItem
            label={t('home')}
            onPress={() => onPress('Home', true)}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'Home'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <Icon
                selected={initialRoute.name === 'Home'}
                size={size}
                iconName="ios-home-outline"
                iconNameSelected="ios-home"
              />
            )}
          />
          <DrawerItem
            label={t('news')}
            onPress={() => onPress('News', true)}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'News'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <Icon
                selected={initialRoute.name === 'News'}
                size={size}
                iconName="ios-newspaper-outline"
                iconNameSelected="ios-newspaper"
              />
            )}
          />
        </CustomDrawerSection>

        <CustomDrawerSection>
          <DrawerItem
            label={t('stats')}
            onPress={() => onPress('Stats', true)}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'Stats'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={initialRoute.name === 'Stats' ? 'chart-areaspline' : 'chart-line'}
                size={size}
                color={
                  initialRoute.name === 'Stats'
                    ? theme.colors.drawerSelected
                    : theme.colors.drawerText
                }
              />
            )}
          />
          {/* <DrawerItem
            label={t('charts')}
            onPress={() => onPress(t('charts'))}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size}         color={initialRoute.name === 'Home'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText} />
            )}
          /> */}
          <DrawerItem
            label={t('farmers')}
            onPress={() => onPress('Farmers', true)}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'Farmers'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <Icon
                selected={initialRoute.name === 'Farmers'}
                size={size}
                iconName="ios-people-outline"
                iconNameSelected="ios-people"
              />
            )}
          />
          <DrawerItem
            label={t('blocksFound')}
            onPress={() => onPress('Blocks Found', true)}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'Blocks Found'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <Icon
                selected={initialRoute.name === 'Blocks Found'}
                size={size}
                iconName="ios-layers-outline"
                iconNameSelected="layers"
              />
            )}
          />
          <DrawerItem
            label={t('payouts')}
            onPress={() => onPress('Payouts', true)}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'Payouts'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <Icon
                selected={initialRoute.name === 'Payouts'}
                size={size}
                iconName="ios-card-outline"
                iconNameSelected="ios-card"
              />
            )}
          />
        </CustomDrawerSection>
        <CustomDrawerSection>
          <DrawerItem
            label={t('giveaway')}
            onPress={() => onPress('Giveaway', true)}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'Giveaway'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <Icon
                selected={initialRoute.name === 'Giveaway'}
                size={size}
                iconName="ios-gift-outline"
                iconNameSelected="ios-gift"
              />
            )}
          />
        </CustomDrawerSection>
        <CustomDrawerSection>
          {groups.length > 0 && (
            <DrawerItem
              label={settings.groupName}
              onPress={() => {
                console.log({
                  name: 'Farmer Group',
                  data: groups,
                });
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Farmer Group',
                      params: { data: groups },
                    },
                  ],
                });
                setIntialRoute({
                  name: 'Farmer Group',
                  data: groups,
                });
                // setIntialRoute({
                //   name: 'Farmer Details Drawer',
                // });
              }}
              labelStyle={{
                fontWeight: 'bold',
                color:
                  initialRoute.name === 'Farmer Group'
                    ? theme.colors.drawerSelected
                    : theme.colors.drawerText,
              }}
              icon={({ color, size }) => (
                <Icon
                  selected={initialRoute.name === 'Farmer Group'}
                  size={size}
                  iconName="folder-open-outline"
                  iconNameSelected="folder-open"
                />
              )}
            />
          )}
        </CustomDrawerSection>
        {launcherIDsArray.length > 0 && (
          <CustomDrawerSection title={t('farms')}>
            {launcherIDsArray.map((item) => (
              <TouchableRipple
                borderless
                key={item.name}
                style={{ marginHorizontal: 10, marginVertical: 4, borderRadius: roundness }}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'Farmer Drawer',
                        params: { data: { launcherId: item.name, name: item.value.name } },
                      },
                    ],
                  });
                  setIntialRoute({
                    name: 'Farmer Drawer',
                    launcherId: item.name,
                    launcherName: item.value.name,
                  });
                }}
              >
                <View style={styles.preference}>
                  {item.value.token ? (
                    <ChiaIconVerified
                      style={{ height: 24, width: 24 }}
                      color={
                        initialRoute.launcherId === item.name
                          ? theme.colors.drawerSelected
                          : theme.colors.drawerText
                      }
                    />
                  ) : (
                    <ChiaIcon
                      style={{ height: 24, width: 24 }}
                      color={
                        initialRoute.launcherId === item.name
                          ? theme.colors.drawerSelected
                          : theme.colors.drawerText
                      }
                    />
                  )}
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: 'bold',
                      color:
                        initialRoute.launcherId === item.name
                          ? theme.colors.drawerSelected
                          : theme.colors.drawerText,
                      flex: 1,
                      marginStart: 32,
                    }}
                  >
                    {item.value.name ? item.value.name : item.name}
                  </Text>
                </View>
              </TouchableRipple>
            ))}
          </CustomDrawerSection>
        )}
        <CustomDrawerSection showDivider={false}>
          <DrawerItem
            label={t('verifyFarm')}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Verify Farm');
            }}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'Verify Farm'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <Ionicons
                name="qr-code-outline"
                size={size}
                color={
                  initialRoute.name === 'Verify Farm'
                    ? theme.colors.drawerSelected
                    : theme.colors.drawerText
                }
              />
            )}
          />
          <DrawerItem
            label={t('settings')}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Settings');
            }}
            labelStyle={{
              fontWeight: 'bold',
              color:
                initialRoute.name === 'Settings'
                  ? theme.colors.drawerSelected
                  : theme.colors.drawerText,
            }}
            icon={({ color, size }) => (
              <Ionicons
                name="ios-settings-outline"
                size={size}
                color={
                  initialRoute.name === 'Settings'
                    ? theme.colors.drawerSelected
                    : theme.colors.drawerText
                }
              />
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
    padding: 8,
    // paddingVertical: 12,
    // paddingHorizontal: 16,
  },
});

export default CustomDrawerContent;
