import React, { Component } from 'react';

import { AppRegistry, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { getObject, saveObject } from '../utils/Utils';
import { postFCMToken } from '../Api';

const ScanScreen = () => {
  const onSuccess = (e) => {
    // saveObject('tokens');
    // getObject('fcm').then((token) => {
    //   // console.log(e.data, token);
    //   postFCMToken(e.data, token).then((data) => console.log(data));
    // });
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      // flashMode={RNCamera.Constants.FlashMode.torch}
      // topContent={
      //   <Text style={styles.centerText}>
      //     Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer
      //     and scan the QR code.
      //   </Text>
      // }
      // bottomContent={
      //   <TouchableOpacity style={styles.buttonTouchable}>
      //     <Text style={styles.buttonText}>OK. Got it!</Text>
      //   </TouchableOpacity>
      // }
    />
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
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
