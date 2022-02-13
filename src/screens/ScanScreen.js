import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useRecoilState } from 'recoil';
import { getLauncherIDFromToken, getPayoutAddress, updateFCMToken } from '../Api';
import { launcherIDsState } from '../Atoms';
import { encode_puzzle_hash } from '../utils/bech32';
import { getObject } from '../utils/Utils';

const ScanScreen = ({ navigation }) => {
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const scanner = useRef(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const onSuccess = (e) => {
    const token = e.data;
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
      ref={scanner}
      onRead={onSuccess}
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
