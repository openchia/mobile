import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useRecoilState } from 'recoil';
import { getLauncherIDFromToken, getPayoutAddress, updateFCMToken } from '../Api';
import { launcherIDsState, settingsState, tokensState } from '../Atoms';
import { encode_puzzle_hash } from '../utils/bech32';
import { getObject } from '../utils/Utils';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const ScanScreen = ({ navigation }) => {
  const [tokens, setTokens] = useRecoilState(tokensState);
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  // const [launcherIDs, setLauncherIDs] = useState([]);
  // const [settings, setSettings] = useRecoilState(settingsState);
  const scanner = useRef(null);
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const { t } = useTranslation();

  const onSuccess = (e) => {
    const token = e.data;
    setTokens((prev) => new Set(prev.add(token)));
    getLauncherIDFromToken(token).then((data) => {
      if (data) {
        getPayoutAddress(data.launcher_id).then((response) => {
          const address = encode_puzzle_hash(response.results[0].puzzle_hash, 'xch');
          if (!launcherIDs.map((item) => item.launcherId).includes(data.launcher_id)) {
            setLauncherIDs((prev) => [
              ...prev,
              {
                launcherId: data.launcher_id,
                name: data.name,
                token,
                address,
              },
            ]);
          }
          getObject('fcm').then((FCMToken) => {
            updateFCMToken(data.launcher_id, token, FCMToken).then(() => {
              navigation.pop();
            });
          });
        });
      } else {
        console.log('Error');
      }
    });
  };

  return (
    <QRCodeScanner
      // reactivate
      ref={scanner}
      onRead={onSuccess}
      // reactivateTimeout={2000}
      cameraProps={{ ratio: '1:1' }}
      showMarker
      topContent={
        <Text style={[{ color: theme.colors.text }, styles.centerText]}>{t('scanDesc')}</Text>
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
