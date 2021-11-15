import React, { Node, useCallback, useMemo, useState, Suspense, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RecoilRoot } from 'recoil';
import ApplicationNavigator from './src/ApplicationNavigator';
import LoadingComponent from './src/components/LoadingComponent';
import './src/constants/IMLocalize';
import { Notifications } from 'react-native-notifications';

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/fr-BE');
  require('intl/locale-data/jsonp/nl-BE');
  require('intl/locale-data/jsonp/it-IT');
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
}
const App = () => {
  useEffect(() => {
    Notifications.registerRemoteNotifications();

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(
        `Notification received in foreground: ${notification.title} : ${notification.body}`
      );
      completion({ alert: false, sound: false, badge: false });
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      completion();
    });
  }, []);

  return (
    <RecoilRoot>
      <Suspense fallback={<LoadingComponent />}>
        <ApplicationNavigator />
      </Suspense>
    </RecoilRoot>
  );
};
export default App;
