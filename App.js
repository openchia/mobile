import React, { Node, useCallback, useMemo, useState, Suspense, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RecoilRoot } from 'recoil';
import { Notifications } from 'react-native-notifications';
// import * as Sentry from '@sentry/react-native';
import ApplicationNavigator from './src/ApplicationNavigator';
import LoadingComponent from './src/components/LoadingComponent';
import './src/constants/IMLocalize';

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
const App = () => {
  useEffect(() => {
    Notifications.registerRemoteNotifications();

    if (Platform.OS === 'ios') {
      Notifications.ios.checkPermissions().then((currentPermissions) => {
        console.log(`Badges enabled: ${!!currentPermissions.badge}`);
        console.log(`Sounds enabled: ${!!currentPermissions.sound}`);
        console.log(`Alerts enabled: ${!!currentPermissions.alert}`);
        console.log(`Car Play enabled: ${!!currentPermissions.carPlay}`);
        console.log(`Critical Alerts enabled: ${!!currentPermissions.criticalAlert}`);
        console.log(`Provisioanl enabled: ${!!currentPermissions.provisional}`);
        console.log(
          `Provides App Notification Settings enabled: ${!!currentPermissions.providesAppNotificationSettings}`
        );
        console.log(`Announcement enabled: ${!!currentPermissions.announcement}`);
      });
    }

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log('Device Token Received', event.deviceToken);
    });
    Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error(event);
    });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log('Notification Received - Foreground', notification.payload);

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({ alert: true, sound: true, badge: false });
    });

    Notifications.events().registerNotificationOpened((notification, completion, action) => {
      console.log('Notification opened by device user', notification.payload);
      console.log(
        `Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`
      );
      completion();
    });

    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
      console.log('Notification Received - Background', notification.payload);

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({ alert: true, sound: true, badge: false });
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
