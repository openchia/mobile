import React, { Component, useRef } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
  SafeAreaView,
  useWindowDimensions,
  Dimensions,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';
import { getObject, saveObject } from '../utils/Utils';
import { getLauncherIDFromToken, updateFCMToken } from '../Api';
import { tokensState, launcherIDsState, settingsState } from '../Atoms';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const ScanScreen = ({ navigation }) => {
  const [tokens, setTokens] = useRecoilState(tokensState);
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const [settings, setSettings] = useRecoilState(settingsState);
  const scanner = useRef(null);
  const { width, height } = useWindowDimensions();
  const theme = useTheme();

  const onSuccess = (e) => {
    const token = e.data;
    setTokens((prev) => new Set(prev.add(token)));
    getLauncherIDFromToken(token).then((data) => {
      setLauncherIDs((prev) => new Map(prev.set(data.launcher_id, { name: 'Nusskefer', token })));
      if (settings.notifications) {
        getObject('fcm').then((FCMToken) => {
          updateFCMToken(data.launcher_id, token, FCMToken).then(() => {
            navigation.navigate({
              name: 'Farmer Details',
              params: { launcherId: data.launcher_id, name: data.name },
            });
          });
        });
      } else {
        navigation.navigate({
          name: 'Farmer Details',
          params: { launcherId: data.launcher_id, name: data.name },
        });
      }
    });
  };

  return (
    <QRCodeScanner
      ref={scanner}
      cameraProps={{ ratio: '1:1' }}
      showMarker
      topContent={
        <Text style={[{ color: theme.colors.text }, styles.centerText]}>
          Scan QR code from pool login link to receive notifications.
        </Text>
      }
      markerStyle={{
        borderColor: 'white',
        borderRadius: 20,
      }}
    />
    // <QRCodeScanner
    //   reactivate
    //   ref={scanner}
    //   showMarker
    //   // topViewStyle={{ height: 0, flex: 0, margin: 0, padding: 0 }}
    //   // bottomViewStyle={{ height: 0, flex: 0, margin: 0, padding: 0 }}
    //   containerStyle={{ display: 'flex' }}
    //   // cameraStyle={{ height: width, width }}
    //   // cameraContainerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    //   topContent={
    //     <Text style={styles.centerText}>
    //       Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and
    //       scan the QR code.
    //     </Text>
    //   }
    //   reactivateTimeout={2000}
    //   onRead={onSuccess}
    // markerStyle={{
    //   borderColor: 'white',
    //   borderRadius: 20,
    //   // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // }}
    // />
  );
};

const styles = StyleSheet.create({
  centerText: {
    fontSize: 18,
    padding: 32,
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default ScanScreen;
