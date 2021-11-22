import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, View, StyleSheet } from 'react-native';
import {
  Card,
  useTheme,
  Text,
  Switch,
  Portal,
  Dialog,
  Paragraph,
  Button,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { currencyState, initialRouteState, launcherIDsState, settingsState } from '../../Atoms';
import PressableCard from '../../components/PressableCard';
import LoadingComponent from '../../components/LoadingComponent';
import IconButton from '../../components/IconButton';
import { updateFCMToken } from '../../Api';

const FarmerSettingsScreen = ({ route, navigation }) => {
  // const theme = useTheme();
  // const LeftContent = (props) => <Text style={{ marginEnd: 16 }}>test</Text>;
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const { launcherId, token } = route.params;
  const [settings, setSettings] = useRecoilState(settingsState);
  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;
  const currency = useRecoilValue(currencyState);
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const setIntialRoute = useSetRecoilState(initialRouteState);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginEnd: -12,
            alignItems: 'center',
          }}
        >
          <IconButton
            icon={<Ionicons name="ios-trash-bin-outline" size={24} color="white" />}
            style={{ marginEnd: 20 }}
            color="#fff"
            size={24}
            onPress={showDialog}
          />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        paddingTop: 8,
        flex: 1,
      }}
    >
      <PressableCard
        onPress={() => {
          if (token) navigation.navigate({ name: 'Name', params: { launcherId, token } });
        }}
      >
        <View
          style={[
            styles.content,
            { backgroundColor: token ? 'rgba(0, 0, 0, 0.0)' : 'rgba(0, 0, 0, 0.25)' },
          ]}
        >
          <Ionicons
            name="ios-person-outline"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('common:name')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {launcherIDs.get(launcherId) ? launcherIDs.get(launcherId).name : ''}
            </Text>
          </View>
          <Ionicons
            name="ios-create-outline"
            size={30}
            color={theme.colors.textGrey}
            // style={{ marginEnd: 16 }}
          />
          {/* <Text style={styles.desc}>
            {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
          </Text> */}
        </View>
      </PressableCard>
      <PressableCard onPress={() => {}}>
        <View style={styles.content}>
          <Ionicons
            name="ios-notifications-outline"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('common:notifications')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('common:notificationsDesc')}
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
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Remove Farm</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to remove it ?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={() => {
                setLauncherIDs((prev) => {
                  const newState = new Map(prev);
                  const launcherData = prev.get(launcherId);
                  if (launcherData.toke) {
                    updateFCMToken(launcherId, launcherData.token, null).then((data) => {
                      console.log(
                        `Successfully removed FCM Token for launcher ${launcherData.name}`
                      );
                    });
                  }
                  newState.delete(launcherId);
                  return newState;
                });
                setIntialRoute({ name: t('navigate:farmers') });
                navigation.pop();
                navigation.pop();
                navigation.reset({
                  index: 0,
                  routes: [{ name: t('navigate:farmers') }],
                });
              }}
            >
              Remove
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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

export default FarmerSettingsScreen;
