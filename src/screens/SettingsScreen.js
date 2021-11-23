import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, View, StyleSheet } from 'react-native';
import { Card, useTheme, Text, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LANGUAGES } from './LanguageSelectorScreen';
import { currencyState, settingsState } from '../Atoms';
import PressableCard from '../components/PressableCard';
import { getCurrencyTitle } from './CurrencySelectionScreen';

const SettingsScreen = ({ navigation }) => {
  // const theme = useTheme();
  // const LeftContent = (props) => <Text style={{ marginEnd: 16 }}>test</Text>;
  const [settings, setSettings] = useRecoilState(settingsState);
  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;
  const currency = useRecoilValue(currencyState);
  const theme = useTheme();

  const toggleTheme = () => {
    setSettings((prev) => ({ ...prev, isThemeDark: !prev.isThemeDark }));
  };

  const toggleNotifications = () => {
    // if (launcherIDsArray.length > 0) {
    //   getObject('fcm').then((FCMToken) => {
    //     launcherIDsArray.forEach((element) => {
    //       // console.log(element);
    //       updateFCMToken(
    //         element.name,
    //         element.value.token,
    //         !settings.notifications ? FCMToken : null
    //       ).then((data) => {
    //         console.log(`Successfully set notifications to: ${!settings.notifications}\n`, data);
    //       });
    //     });
    //   });
    // }
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  return (
    <SafeAreaView
      style={{
        marginTop: 8,
        flex: 1,
      }}
    >
      {/* <Text style={{ fontSize: 20, padding: 10 }}>{t('common:general')}</Text> */}
      <PressableCard onPress={() => navigation.navigate(`${t('common:currency')}`)}>
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="currency-usd-circle-outline"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('common:currency')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {getCurrencyTitle(currency)}
              {/* {t('common:currencyDesc')} */}
              {/* Set preferred currency. */}
            </Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={theme.colors.textGrey}
            // style={{ marginEnd: 16 }}
          />
          {/* <Text style={styles.desc}>{currency.toUpperCase()}</Text> */}
        </View>
      </PressableCard>
      <PressableCard onPress={() => navigation.navigate(`${t('common:language')}`)}>
        <View style={styles.content}>
          <Ionicons
            name="language"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('common:language')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
              {/* {t('common:languageDesc')} */}
            </Text>
          </View>
          {/* <Text style={styles.desc}>
            {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
          </Text> */}
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={theme.colors.textGrey}
            // style={{ marginEnd: 16 }}
          />
        </View>
      </PressableCard>
      <PressableCard onPress={toggleNotifications}>
        <View style={styles.content}>
          <Ionicons
            name="ios-notifications-outline"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('common:notification')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('common:notificationDesc')}
            </Text>
          </View>
          <View pointerEvents="none">
            <Switch value={settings.notifications} />
          </View>
          {/* <Text style={styles.desc}>
            {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
          </Text> */}
        </View>
      </PressableCard>
      <PressableCard onPress={toggleTheme}>
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('common:appearance')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('common:appearanceDesc')}
            </Text>
          </View>
          <View pointerEvents="none">
            <Switch value={settings.isThemeDark} />
          </View>
          {/* <Text style={styles.desc}>
            {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
          </Text> */}
        </View>
      </PressableCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: 14,
    paddingBottom: 6,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  desc: {
    fontSize: 12,
  },
});

export default SettingsScreen;
