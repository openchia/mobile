import React, { useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Switch, Text, TextInput, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import IconButton from '../../components/IconButton';
import PressableCard from '../../components/PressableCard';
import { launcherIDsState, settingsState } from '../../Atoms';
import { updateFarmerBlockNotification, updateFarmerMissingPartialsNotification } from '../../Api';

const FarmerNotificationScreen = ({ route, navigation }) => {
  const { launcherId, token, name } = route.params;
  const [settings, setSettings] = useRecoilState(settingsState);
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const item = launcherIDs.get(launcherId);
  if (item.blockNotification === undefined) {
    item.blockNotification = true;
  }
  if (item.farmOfflineNotification === undefined) {
    item.farmOfflineNotification = null;
  }

  const toggleBlockNotification = () => {
    // console.log(launcherIDs);
    setLauncherIDs(
      (prev) =>
        new Map(
          prev.set(launcherId, {
            ...prev.get(launcherId),
            blockNotification: !item.blockNotification,
          })
        )
    );
    updateFarmerBlockNotification(launcherId, token, !item.blockNotification).then((data) => {
      console.log(data);
    });
  };

  const togglefarmOfflineNotification = () => {
    // console.log(launcherIDs);
    setLauncherIDs(
      (prev) =>
        new Map(
          prev.set(launcherId, {
            ...prev.get(launcherId),
            farmOfflineNotification: item.farmOfflineNotification !== null ? null : 1,
          })
        )
    );
    updateFarmerMissingPartialsNotification(
      launcherId,
      token,
      item.farmOfflineNotification !== null ? null : 1
    ).then((data) => {
      console.log(data);
    });
  };

  return (
    <SafeAreaView
      style={{
        marginTop: 8,
        flex: 1,
      }}
    >
      <PressableCard
        style={{ marginVertical: 2, marginHorizontal: 8 }}
        onPress={togglefarmOfflineNotification}
      >
        <View style={styles.content}>
          <Ionicons
            name={
              item.farmOfflineNotification === 1 ? 'ios-notifications' : 'ios-notifications-outline'
            }
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('farmerOffline')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('farmerOfflineNotification')}
            </Text>
          </View>
          <View pointerEvents="none">
            <Switch value={item.farmOfflineNotification === 1} />
          </View>
        </View>
      </PressableCard>
      <PressableCard
        style={{ marginVertical: 2, marginHorizontal: 8 }}
        onPress={toggleBlockNotification}
      >
        <View style={styles.content}>
          <Ionicons
            name={item.blockNotification ? 'ios-notifications' : 'ios-notifications-outline'}
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('blocks')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('farmerBlockNotification')}
            </Text>
          </View>
          <View pointerEvents="none">
            <Switch value={item.blockNotification} />
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
  delete: {
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
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

export default FarmerNotificationScreen;
