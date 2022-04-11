import messaging from '@react-native-firebase/messaging';
import React, { Suspense, useEffect } from 'react';
import { Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { RecoilRoot } from 'recoil';
import ApplicationNavigator from './src/ApplicationNavigator';
import LoadingComponent from './src/components/LoadingComponent';
// import './src/constants/IMLocalize';
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

// const updateLocalization = () => {
//   Crowdin.initWithHashString('fcaf0dd82870a8dfbcc5f9876j9', DEFAULT_LANGUAGE, (message) => {});

//   Crowdin.getResourcesByLocale('uk', (data) => {
//     var response = JSON.parse(data);

//     translations.setContent(
//       Object.assign({}, translations.getContent(), {
//         uk: response.strings,
//       })
//     );

//     this.resetState();
//   });
// };

const requestUserPermission = async () => {
  // const token = await messaging().getToken();
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
  }
};

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
