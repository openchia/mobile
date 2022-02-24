import messaging from '@react-native-firebase/messaging';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text } from 'react-native';
import Dialog from 'react-native-dialog';
import { useTheme } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useRecoilState } from 'recoil';
import { launcherIDsState } from '../../recoil/Atoms';
import { getLauncherIDFromToken, getPayoutAddress, updateFCMToken } from '../../services/Api';
import { encodePuzzleHash } from '../../utils/bech32';

const ScanScreen = ({ navigation }) => {
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const scanner = useRef(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const onSuccess = (e) => {
    const token = e.data;
    getLauncherIDFromToken(token).then((data) => {
      if (data) {
        getPayoutAddress(data.launcher_id).then((response) => {
          const address = encodePuzzleHash(response.results[0].puzzle_hash, 'xch');
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
          messaging()
            .getToken()
            .then((FCMToken) => {
              updateFCMToken(data.launcher_id, token, FCMToken).then(() => {
                navigation.pop();
              });
            });
        });
      } else {
        showDialog();
        // setTimeout(() => {
        //   scanner.current.reactivate();
        // }, 1000);
        // console.log('Error');
      }
    });
  };

  return (
    <>
      <QRCodeScanner
        ref={scanner}
        fadeIn
        onRead={onSuccess}
        cameraProps={{ ratio: '1:1' }}
        showMarker
        topContent={
          // <Text style={styles.centerText}>
          //   Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and
          //   scan the QR code.
          // </Text>
          <Text style={[{ color: theme.colors.text }, styles.centerText]}>{t('scanDesc')}</Text>
        }
        markerStyle={{
          borderColor: 'white',
          borderRadius: 20,
        }}
      />
      {Platform.OS === 'android' ? (
        <Dialog.Container
          contentStyle={{ backgroundColor: theme.colors.onSurfaceLight }}
          visible={visible}
          onBackdropPress={() => {
            hideDialog();
            scanner.current.reactivate();
          }}
        >
          <Dialog.Title style={{ color: theme.colors.text }}>Invalid QR Code</Dialog.Title>
          <Dialog.Description style={{ color: theme.colors.textGrey }}>
            Please make sure you are scanning the qr code found on our website when opening the pool
            login link. The pool login link can be found under the pools tab in your chia full node,
            or by using chia cli.
          </Dialog.Description>
          <Dialog.Button
            bold
            color={theme.colors.primaryLight}
            label="Ok"
            onPress={() => {
              hideDialog();
              scanner.current.reactivate();
            }}
          />
        </Dialog.Container>
      ) : (
        <Dialog.Container
          visible={visible}
          onBackdropPress={() => {
            hideDialog();
            scanner.current.reactivate();
          }}
        >
          <Dialog.Title>Invalid QR Code</Dialog.Title>
          <Dialog.Description>
            Please make sure you are scanning the qr code found on our website when opening the pool
            login link. The pool login link can be found under the pools tab in your chia full node,
            or by using chia cli.
          </Dialog.Description>
          <Dialog.Button
            bold
            label="Ok"
            onPress={() => {
              hideDialog();
              scanner.current.reactivate();
            }}
          />
        </Dialog.Container>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 16,
    // paddingBottom: 32,
    // paddingTop: 20,
    // padding: 32,
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
