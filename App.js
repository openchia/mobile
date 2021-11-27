import React, { Node, useCallback, useMemo, useState, Suspense, useEffect } from 'react';
import { Alert, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RecoilRoot } from 'recoil';
import { Notifications } from 'react-native-notifications';
// import { Notifications } from 'react-native-notifications';
// import * as Sentry from '@sentry/react-native';
import messaging from '@react-native-firebase/messaging';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import NetInfo from '@react-native-community/netinfo';
import { saveObject } from './src/utils/Utils';
import ApplicationNavigator from './src/ApplicationNavigator';
import LoadingComponent from './src/components/LoadingComponent';
// import './src/constants/IMLocalize';
import './src/localization/i18n';

// Sentry.init({
//   dsn: 'https://7426074fea104d898f7fcaba3e94d45d@o1071760.ingest.sentry.io/6069453',
// });
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/fr-BE');
  require('intl/locale-data/jsonp/nl-BE');
  require('intl/locale-data/jsonp/it-IT');
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
}

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

const App = () => {
  useEffect(() => {
    requestUserPermission();

    // SystemNavigationBar.navigationHide();

    // Notifications.registerRemoteNotifications();

    // Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
    //   console.log(
    //     `Notification received in foreground: ${notification.title} : ${notification.body}`
    //   );
    //   completion({ alert: false, sound: false, badge: false });
    // });

    // Notifications.events().registerNotificationOpened((notification, completion) => {
    //   console.log(`Notification opened: ${notification.payload}`);
    //   completion();
    // });r
    const unsubscribe = messaging().onMessage(onMessageReceived);
    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //   console.log(remoteMessage);
    //   // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // });

    return unsubscribe;
  }, []);
  // useEffect(() => {
  //   const unsubscribe = messaging()
  //     .subscribeToTopic('blocks')
  //     .then(() => console.log('Subscribed to topic blocks!'));

  //   return unsubscribe;
  // }, []);

  return (
    <RecoilRoot>
      <Suspense fallback={<LoadingComponent />}>
        <ApplicationNavigator />
      </Suspense>
    </RecoilRoot>
  );
};
export default App;
