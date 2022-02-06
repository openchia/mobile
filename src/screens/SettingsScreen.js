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
import CustomCard from '../components/CustomCard';
import CustomIconButton from '../components/CustomIconButton';
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

  const toggleActiveFarmers = () => {
    setSettings((prev) => ({ ...prev, showOnlyActiveFarmers: !prev.showOnlyActiveFarmers }));
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
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.onSurface,
      }}
    >
      <PressableCard onPress={() => navigation.navigate('Currency')}>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('currency')}</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                { fontFamily: theme.fonts.medium.fontFamily, color: theme.colors.textGrey },
              ]}
            >
              {getCurrencyTitle(currency)}
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
      <PressableCard onPress={() => navigation.navigate('Language')}>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('language')}</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                { fontFamily: theme.fonts.medium.fontFamily, color: theme.colors.textGrey },
              ]}
            >
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
      <PressableCard onPress={toggleNotifications}>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('notification')}</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                { fontFamily: theme.fonts.medium.fontFamily, color: theme.colors.textGrey },
              ]}
            >
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
      <CustomCard>
        <View style={styles.content}>
          {/* <MaterialCommunityIcons
            name="theme-light-dark"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          /> */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('appearance')}</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                { fontFamily: theme.fonts.medium.fontFamily, color: theme.colors.textGrey },
              ]}
            >
              {t('appearanceDesc')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <CustomIconButton
              icon={
                <Ionicons
                  name={settings.isThemeDark ? 'ios-sunny-outline' : 'ios-sunny'}
                  size={30}
                  color={theme.colors.textGrey}
                  onPress={() => {
                    setSettings((prev) => ({ ...prev, isThemeDark: false }));
                  }}
                  // style={{ marginEnd: 16 }}
                />
              }
            />
            <View
              style={{
                width: 1,
                backgroundColor: theme.colors.textGrey,
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <CustomIconButton
              icon={
                <Ionicons
                  style={{ alignSelf: 'center' }}
                  name={settings.isThemeDark ? 'ios-moon' : 'ios-moon-outline'}
                  size={24}
                  color={theme.colors.textGrey}
                  onPress={() => {
                    setSettings((prev) => ({ ...prev, isThemeDark: true }));
                  }}
                />
              }
            />
            {/* <Ionicons
              style={{ alignSelf: 'center' }}
              name={settings.isThemeDark ? 'ios-moon-outline' : 'ios-moon-outline'}
              size={24}
              color={theme.colors.textGrey}
            /> */}
          </View>
        </View>
      </CustomCard>
      <PressableCard onPress={toggleActiveFarmers}>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('activeFarms')}</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                { fontFamily: theme.fonts.medium.fontFamily, color: theme.colors.textGrey },
              ]}
            >
              {t('activeFarmsDesc')}
            </Text>
          </View>
          <View pointerEvents="none">
            <Switch value={settings.showOnlyActiveFarmers} />
          </View>
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
    paddingTop: 16,
    marginHorizontal: 16,
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: 14,
    // paddingBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default SettingsScreen;
