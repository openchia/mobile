import messaging from '@react-native-firebase/messaging';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Switch, Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currencyState, settingsState } from '../Atoms';
import PressableCard from '../components/PressableCard';
import { getCurrencyTitle } from './CurrencySelectionScreen';
import { LANGUAGES } from './LanguageSelectorScreen';

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
    // if (launcherIDsArray.length > 0) {
    //   getObject('fcm').then((FCMToken) => {
    //     launcherIDsArray.forEach((element) => {
    //       // console.log(element);
    //       updateFCMToken(
    //         element.name,
    //         element.value.token,
    //         !settings.blockNotifications ? FCMToken : null
    //       ).then((data) => {
    //         console.log(`Successfully set notifications to: ${!settings.blockNotifications}\n`, data);
    //       });
    //     });
    //   });
    // }
  };

  return (
    <SafeAreaView
      style={{
        marginTop: 8,
        flex: 1,
      }}
    >
      {/* <Text style={{ fontSize: 20, padding: 10 }}>{t('general')}</Text> */}
      <PressableCard
        style={{ marginVertical: 2, marginHorizontal: 8 }}
        onPress={() => navigation.navigate('Currency')}
      >
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="currency-usd-circle-outline"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('currency')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {getCurrencyTitle(currency)}
              {/* {t('currencyDesc')} */}
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
      <PressableCard
        style={{ marginVertical: 4, marginHorizontal: 8 }}
        onPress={() => navigation.navigate('Language')}
      >
        <View style={styles.content}>
          <Ionicons
            name="language"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('language')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
              {/* {t('languageDesc')} */}
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
      <PressableCard
        style={{ marginVertical: 4, marginHorizontal: 8 }}
        onPress={toggleNotifications}
      >
        <View style={styles.content}>
          <Ionicons
            name="ios-notifications-outline"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('notification')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('notificationDesc')}
            </Text>
          </View>
          <View pointerEvents="none">
            <Switch value={settings.blockNotifications} />
          </View>
          {/* <Text style={styles.desc}>
            {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
          </Text> */}
        </View>
      </PressableCard>
      <PressableCard style={{ marginVertical: 4, marginHorizontal: 8 }} onPress={toggleTheme}>
        <View style={styles.content}>
          <Ionicons
            name={settings.isThemeDark ? 'ios-moon-outline' : 'ios-sunny-outline'}
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          {/* <MaterialCommunityIcons
            name="theme-light-dark"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          /> */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('appearance')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('appearanceDesc')}
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
