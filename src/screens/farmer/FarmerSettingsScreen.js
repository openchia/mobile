import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  updateFarmerBlockNotification,
  updateFarmerMissingPartialsNotification,
  updateFCMToken,
} from '../../Api';
import { initialRouteState, launcherIDsState, settingsState } from '../../Atoms';
import IconButton from '../../components/IconButton';
import PressableCard from '../../components/PressableCard';

const FarmerSettingsScreen = ({ route, navigation }) => {
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const { launcherId, token } = route.params;
  const [settings, setSettings] = useRecoilState(settingsState);
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const setIntialRoute = useSetRecoilState(initialRouteState);
  const { t } = useTranslation();

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
        marginTop: 8,
        flex: 1,
      }}
    >
      <PressableCard
        style={{ marginVertical: 2, marginHorizontal: 8 }}
        onPress={() => {
          if (token)
            navigation.navigate({
              name: 'Farmer Name',
              params: { launcherId, token, name: launcherIDs.get(launcherId).name },
            });
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
            <Text style={styles.title}>{t('farmerName')}</Text>
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
      <PressableCard
        style={{ marginVertical: 4, marginHorizontal: 8 }}
        onPress={() => {
          navigation.navigate({
            name: 'Farmer Notifications',
            params: { launcherId, token, name: launcherIDs.get(launcherId).name },
          });
        }}
      >
        <View
          style={[
            styles.content,
            // { backgroundColor: settings.isThemeDark ? '#292929' : '#bdbdbd' },
          ]}
        >
          <Ionicons
            name="ios-notifications-outline"
            size={30}
            color={theme.colors.textGrey}
            style={{ marginEnd: 16 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('notifications')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('notificationsDesc')}
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
            <Button color={theme.colors.primaryLight} onPress={hideDialog}>
              Cancel
            </Button>
            <Button
              color={theme.colors.primaryLight}
              onPress={() => {
                setLauncherIDs((prev) => {
                  const newState = new Map(prev);
                  const launcherData = prev.get(launcherId);
                  // if (launcherData.farmOfflineNotification === 1) {
                  //   updateFarmerMissingPartialsNotification(launcherId, token, null).then(
                  //     (response) => {
                  //       console.log('Successfully removed device from notifications: ', response);
                  //     }
                  //   );
                  // }
                  // if (launcherData.farmBlockNotifications) {
                  //   updateFarmerBlockNotification(launcherId, token, false).then((response) => {
                  //     console.log(response);
                  //   });
                  // }
                  if (launcherData.token) {
                    updateFCMToken(launcherId, launcherData.token, null).then((response) => {
                      console.log(
                        `Successfully removed FCM Token for launcher ${launcherData.name}: `,
                        response
                      );
                    });
                  }
                  newState.delete(launcherId);
                  return newState;
                });
                hideDialog();
                setIntialRoute({ name: 'Home' });
                navigation.goBack();
                // navigation.pop();
                // navigation.pop();
                // navigation.reset({
                //   index: 0,
                //   routes: [{ name: t('navigate:farmers') }],
                // });
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
