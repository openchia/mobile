/* eslint-disable no-nested-ternary */
import messaging from '@react-native-firebase/messaging';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, SafeAreaView, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Switch, Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currencyState, settingsState } from '../../Atoms';
import CustomIconButton from '../../components/CustomIconButton';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import PressableCard from '../../components/PressableCard';
import DiscordIcon from '../../images/DiscordIcon';
import OpenChiaTextIconRight from '../../images/OpenChiaTextIconRight';
import { LANGUAGES } from '../../screens/LanguageSelectorScreen';

const Item = ({ item, color, t, onPress, theme }) => (
  <PressableCard
    style={{
      // marginBottom: 2,
      paddingTop: 16,
      paddingBottom: 16,
    }}
    onPress={onPress}
  >
    <View style={{ marginHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
      {item.icon}
      <Text style={{ paddingLeft: 24 }}>{item.name}</Text>
    </View>
    {/* </View> */}
  </PressableCard>
);

const MoreScreen = ({ navigation }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [settings, setSettings] = useRecoilState(settingsState);
  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;
  const currency = useRecoilValue(currencyState);

  const toggleNotifications = () => {
    setSettings((prev) => ({ ...prev, blockNotifications: !prev.blockNotifications }));
    if (!settings.blockNotifications) {
      messaging()
        .subscribeToTopic('blocks')
        .then(() => {
          console.log('Subscribed to block notifications');
        });
    } else {
      messaging()
        .unsubscribeFromTopic('blocks')
        .then(() => {
          console.log('Unsubscribed from block notifications');
        });
    }
  };

  const items = [
    // {
    //   name: 'Giveaway',
    //   navigateTo: 'Giveaway',
    //   icon: <Ionicons name="gift" size={24} color={theme.colors.textGreyLight} />,
    // },
    {
      name: 'Settings',
      navigateTo: 'Settings',
      icon: <Ionicons name="settings" size={24} color={theme.colors.textGreyLight} />,
    },
    {
      name: 'Join our Community',
      // navigateTo: 'Settings',
      url: 'https://discord.com/invite/2URS9H7RZn',
      icon: <MaterialCommunityIcons name="discord" size={24} color={theme.colors.textGreyLight} />,
    },
  ];

  const renderItem = ({ item }) => (
    <Item
      item={item}
      color={theme.colors.textGrey}
      theme={theme}
      t={t}
      onPress={() => {
        if (item.url) {
          Linking.canOpenURL(item.url).then((supported) => {
            if (supported) {
              Linking.openURL(item.url);
            } else {
              Alert.alert(`Don't know how to open this URL: ${item.url}`);
            }
          });
        } else navigation.navigate(item.navigateTo);
      }}
    />
  );

  return (
    <SafeAreaView
      style={{
        // marginTop: 2,
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <FocusAwareStatusBar
        backgroundColor={theme.colors.background}
        barStyle={settings.isThemeDark ? 'light-content' : 'dark-content'}
      />
      <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <OpenChiaTextIconRight
          style={{ width: 160, height: 36 }}
          // size={}
          color={theme.colors.primary}
        />
      </View>
      <ScrollView style={{ flexGrow: 1 }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingBottom: 36,
          }}
        >
          <View style={{ marginEnd: 16 }}>
            <Shadow distance={2} startColor="rgba(0, 0, 0, 0.02)" radius={24}>
              <CustomIconButton
                icon={<Ionicons name="logo-github" size={24} color={theme.colors.text} />}
                onPress={() => {
                  Linking.canOpenURL('https://github.com/openchia').then((supported) => {
                    if (supported) {
                      Linking.openURL('https://github.com/openchia');
                    }
                  });
                }}
                style={{ backgroundColor: theme.colors.onSurfaceLight, margin: 0, padding: 0 }}
                title="Info"
                color="#fff"
              />
            </Shadow>
          </View>
          <View style={{ marginEnd: 16 }}>
            <Shadow distance={2} startColor="rgba(0, 0, 0, 0.02)" radius={24}>
              <CustomIconButton
                icon={<DiscordIcon style={{ height: 24, width: 24 }} color={theme.colors.text} />}
                onPress={() => {
                  Linking.canOpenURL('https://discord.com/invite/2URS9H7RZn').then((supported) => {
                    if (supported) {
                      Linking.openURL('https://discord.com/invite/2URS9H7RZn');
                    }
                  });
                }}
                style={{ backgroundColor: theme.colors.onSurfaceLight, margin: 0, padding: 0 }}
                title="Info"
                color="#fff"
              />
            </Shadow>
          </View>
          <View style={{ marginEnd: 16 }}>
            <Shadow distance={2} startColor="rgba(0, 0, 0, 0.02)" radius={24}>
              <CustomIconButton
                icon={
                  <Ionicons
                    name="md-logo-twitter"
                    size={24}
                    color={theme.colors.text}
                    style={{ margin: 0, padding: 0 }}
                  />
                }
                onPress={() => {
                  Linking.canOpenURL('https://twitter.com/openchia').then((supported) => {
                    if (supported) {
                      Linking.openURL('https://twitter.com/openchia');
                    }
                  });
                }}
                style={{ backgroundColor: theme.colors.onSurfaceLight, margin: 0, padding: 0 }}
                title="Info"
                color="#fff"
              />
            </Shadow>
          </View>
          <Shadow distance={2} startColor="rgba(0, 0, 0, 0.02)" radius={24}>
            <CustomIconButton
              icon={<Ionicons name="ios-logo-youtube" size={24} color={theme.colors.text} />}
              onPress={() => {
                Linking.canOpenURL('https://www.youtube.com/channel/UCL70j_KiPd49rfp_UEqxiyQ').then(
                  (supported) => {
                    if (supported) {
                      Linking.openURL('https://www.youtube.com/channel/UCL70j_KiPd49rfp_UEqxiyQ');
                    }
                  }
                );
              }}
              style={{ backgroundColor: theme.colors.onSurfaceLight, margin: 0, padding: 0 }}
              title="Info"
              color="#fff"
            />
          </Shadow>
        </View>
        <View style={{ alignSelf: 'stretch', margin: 16 }}>
          <Shadow
            distance={2}
            startColor="rgba(0, 0, 0, 0.02)"
            // finalColor="rgba(0, 0, 0, 0.01)"
            // containerViewStyle={{ marginVertical: 16 }}
            radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
            viewStyle={{ alignSelf: 'stretch' }}
          >
            <View
              style={[
                {
                  marginVertical: 0,
                  // padding: 16,
                  backgroundColor: theme.colors.background,
                  borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
                  //   borderRadius: 16,
                },
              ]}
            >
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderTopLeftRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  borderTopRightRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  backgroundColor: theme.colors.onSurfaceLight,
                  marginBottom: 1,
                }}
                onPress={() => {
                  navigation.navigate('Currency');
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>{t('currency')}</Text>
                  <Text
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      color: theme.colors.textGrey,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {currency.toUpperCase()}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 16 }}
                    name="chevron-forward-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  backgroundColor: theme.colors.onSurfaceLight,
                  marginBottom: 1,
                }}
                onPress={() => navigation.navigate('Language')}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>{t('language')}</Text>
                  <Text
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      color: theme.colors.textGrey,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 16 }}
                    name="chevron-forward-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  backgroundColor: theme.colors.onSurfaceLight,
                  marginBottom: 1,
                }}
                onPress={() => navigation.navigate('LaunchOptionScreen')}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>{t('launchScreen')}</Text>
                  <Text
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      color: theme.colors.textGrey,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {settings.intialRoute === 'Home'
                      ? t('home')
                      : settings.intialRoute === 'Dashboard'
                      ? t('dashboard')
                      : t('news')}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 16 }}
                    name="chevron-forward-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  backgroundColor: theme.colors.onSurfaceLight,
                  marginBottom: 1,
                }}
                onPress={toggleNotifications}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>
                    {settings.blockNotifications
                      ? t('blockOffNotification')
                      : t('blockOnNotification')}
                  </Text>
                  <View pointerEvents="none" style={{ paddingRight: 16 }}>
                    <Switch value={settings.blockNotifications} />
                  </View>
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  backgroundColor: theme.colors.onSurfaceLight,
                  marginBottom: 1,
                }}
                onPress={() => {
                  setSettings((prev) => ({ ...prev, isThemeDark: !prev.isThemeDark }));
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>
                    {settings.isThemeDark ? t('lightMode') : t('darkMode')}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 20 }}
                    name={settings.isThemeDark ? 'ios-moon' : 'ios-sunny'}
                    size={24}
                    color={theme.colors.textGrey}
                  />
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderBottomLeftRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  borderBottomRightRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  backgroundColor: theme.colors.onSurfaceLight,
                }}
                onPress={() => {
                  setSettings((prev) => ({ ...prev, sharpEdges: !prev.sharpEdges }));
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>
                    {settings.sharpEdges ? t('tileModeOff') : t('tileModeOn')}
                  </Text>
                  {settings.sharpEdges ? (
                    <Ionicons
                      style={{ paddingRight: 20 }}
                      name="square-outline"
                      size={24}
                      color={theme.colors.textGrey}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      style={{ paddingRight: 20 }}
                      name="rounded-corner"
                      size={24}
                      color={theme.colors.textGrey}
                    />
                  )}
                  {/* <Ionicons
                    style={{ paddingRight: 20 }}
                    name={settings.sharpEdges ? 'square-outline' : 'circle-outline'}
                    size={24}
                    color={theme.colors.textGrey}
                  /> */}
                </View>
              </PressableCard>
              {/* <View>
              <Text>React Native cross-platform box shadow</Text>
            </View>
            <Text>Using the Platform API to conditionally render box shadow</Text> */}
            </View>
          </Shadow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoreScreen;
