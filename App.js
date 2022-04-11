import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
// import { enableFreeze } from 'react-native-screens';
import { RecoilRoot } from 'recoil';
import BaseScreen from './src/BaseScreen';
import './src/localization/i18n';

// enableFreeze(true);

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/fr-BE');
  require('intl/locale-data/jsonp/nl-BE');
  require('intl/locale-data/jsonp/it-IT');
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
}

const onMessageReceived = (message) => {
  Notifications.postLocalNotification({
    title: message.notification.title,
    body: message.notification.body,
    extra: message.data,
  });
};

const requestUserPermission = async () => {
  await messaging().requestPermission();
};

const App = () => {
  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(onMessageReceived);
    return unsubscribe;
  }, []);

  return (
    <RecoilRoot>
      <BaseScreen />
    </RecoilRoot>
  );
};
export default App;
