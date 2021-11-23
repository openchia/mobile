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
import { initialRouteState, settingsState } from '../Atoms';
import OpenChiaIconWithText from '../images/OpenChiaIconWithText';
import { getObject } from '../utils/Utils';
import CustomDrawerSection from './CustomDrawerSection';

const CustomDrawerContent = (props) => {
  const { navigation, launcherIDsArray } = props;
  const theme = useTheme();
  const { roundness } = theme;
  const { t } = useTranslation();

  const [settings, setSettings] = useRecoilState(settingsState);
  const setIntialRoute = useSetRecoilState(initialRouteState);

  const toggleTheme = () => {
    setSettings((prev) => ({ ...prev, isThemeDark: !prev.isThemeDark }));
  };

  const toggleNotifications = () => {
    if (launcherIDsArray.length > 0) {
      getObject('fcm').then((FCMToken) => {
        launcherIDsArray.forEach((element) => {
          // console.log(element);
          updateFCMToken(
            element.name,
            element.value.token,
            !settings.blockNotifications ? FCMToken : null
          ).then((data) => {
            console.log(
              `Successfully set notifications to: ${!settings.blockNotifications}\n`,
              data
            );
          });
        });
      });
    }
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  const onPress = (location, saveroute) => {
    navigation.navigate('Root', { screen: location, intial: false });
    if (saveroute) {
      setIntialRoute({ name: location });
    }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: location }],
    // });
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
          backgroundColor: settings.isThemeDark ? theme.colors.primary : theme.colors.primary,
          paddingTop: Platform.OS === 'ios' ? 48 : 0,
          paddingLeft: 12,
          height: Platform.OS === 'ios' ? 120 : 72,
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
            label={t('home')}
            onPress={() => onPress('Home', true)}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="ios-home-outline" size={size} color={theme.colors.drawerText} />
            )}
          />
          <DrawerItem
            label={t('news')}
            onPress={() => onPress('News', true)}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="ios-newspaper-outline" size={size} color={theme.colors.drawerText} />
            )}
          />
        </CustomDrawerSection>

        <CustomDrawerSection>
          <DrawerItem
            label={t('stats')}
            onPress={() => onPress('Stats', true)}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-line"
                size={size}
                color={theme.colors.drawerText}
              />
            )}
          />
          {/* <DrawerItem
            label={t('charts')}
            onPress={() => onPress(t('charts'))}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={theme.colors.drawerText} />
            )}
          /> */}
          <DrawerItem
            label={t('farmers')}
            onPress={() => onPress('Farmers', true)}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="ios-people-outline" size={size} color={theme.colors.drawerText} />
            )}
          />
          <DrawerItem
            label={t('blocksFound')}
            onPress={() => onPress('Blocks Found', true)}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="layers-outline" size={size} color={theme.colors.drawerText} />
            )}
          />
          <DrawerItem
            label={t('payouts')}
            onPress={() => onPress('Payouts', true)}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="ios-card-outline" size={size} color={theme.colors.drawerText} />
            )}
          />
        </CustomDrawerSection>
        <CustomDrawerSection>
          <DrawerItem
            label={t('verifyFarm')}
            onPress={() => {
              navigation.navigate('Verify Farm');
              navigation.closeDrawer();
            }}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="qr-code-outline" size={size} color={theme.colors.drawerText} />
            )}
          />
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
                        name: 'Farmer Details Drawer',
                        params: { launcherId: item.name, name: item.value.name },
                      },
                    ],
                  });
                  // console.log(item);
                  // setIntialRoute('Farmer Details Drawer');
                  setIntialRoute({
                    name: 'Farmer Details Drawer',
                    launcherId: item.name,
                    launcherName: item.value.name,
                    // laucherName: item.
                  });
                  //   onPress({ name: 'Farmer Details Drawer', params: { launcherId: item.name } });
                  // navigation.navigate({ name: 'Farmer Details', params: { launcherId: item.name } });
                  // setIntialRoute({ name: 'Farmer Details', params: { launcherId: item.name } });
                  // navigation.closeDrawer();
                }}
              >
                <View style={styles.preference}>
                  <Ionicons name="ios-person-outline" size={24} color={theme.colors.drawerText} />
                  <Text
                    numberOfLines={1}
                    style={{ color: theme.colors.drawerText, flex: 1, marginStart: 32 }}
                  >
                    {item.value.name ? item.value.name : item.name}
                  </Text>
                  {item.value.token && (
                    <MaterialIcons name="verified" size={24} color={theme.colors.drawerText} />
                  )}
                </View>
              </TouchableRipple>
              // <DrawerItem
              //   labelStyle={{ color: theme.colors.drawerText }}
              //   key={item.name}
              //   label={item.value.name ? item.value.name : item.name}
              // onPress={() => {
              //   onPress({ name: 'Farmer Details', params: { launcherId: item.name } });
              //   // getFarmer(item.name)
              //   //   .then((data) => {
              //   //     onPress({ name: 'Farmer Details', params: { item: data } });
              //   //   })
              //   //   .catch((error) => console.log(error));
              // }}
              //   icon={({ color, size }) => (
              //     <MaterialCommunityIcons name="silo" size={size} color={theme.colors.drawerText} />
              //   )}
              // />
            ))}
          </CustomDrawerSection>
        )}
        {/* <CustomDrawerSection label="Preferences">
          <TouchableRipple onPress={() => toggleTheme()}>
            <View style={styles.preference}>
              <Ionicons
                name={settings.isThemeDark ? 'ios-moon-outline' : 'ios-sunny-outline'}
                size={24}
                color={theme.colors.drawerText}
              />
              <Text style={{ color: theme.colors.drawerText, flex: 1, marginStart: 32 }}>
                {t('darkMode')}
              </Text>
              <View pointerEvents="none">
                <Switch value={settings.isThemeDark} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => toggleNotifications()}>
            <View style={styles.preference}>
              <Ionicons name="ios-notifications-outline" size={24} color={theme.colors.drawerText} />
              <Text style={{ color: theme.colors.drawerText, flex: 1, marginStart: 32 }}>
                {t('notifications')}
              </Text>
              <View pointerEvents="none">
                <Switch value={settings.blockNotifications} />
              </View>
            </View>
          </TouchableRipple>
        </CustomDrawerSection> */}
        <CustomDrawerSection showDivider={false}>
          <DrawerItem
            label={t('settings')}
            onPress={() => onPress('Settings', false)}
            labelStyle={{ color: theme.colors.drawerText }}
            icon={({ color, size }) => (
              <Ionicons name="ios-settings-outline" size={size} color={theme.colors.drawerText} />
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
