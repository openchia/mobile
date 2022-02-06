import messaging from '@react-native-firebase/messaging';
import React, { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, Platform, StatusBar, Text, View } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { RecoilRoot } from 'recoil';
import BaseScreen from './src/BaseScreen';
import LoadingComponent from './src/components/LoadingComponent';
// import './src/constants/IMLocalize';
import './src/localization/i18n';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import SystemNavigationBar from 'react-native-system-navigation-bar';

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

// SystemNavigationBar.navigationShow();

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

const App = () => {
  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(onMessageReceived);
    return unsubscribe;
  }, []);

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // callbacks
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        // style={{ position: 'absolute', top: -40, left: 0, right: 0, bottom: 49 }}
        {...props}
      />
    ),
    []
  );

  return (
    // <BottomSheetModalProvider>
    //   <View style={{ flex: 1 }}>
    //     <StatusBar
    //       // backgroundColor={theme.colors.statusBarColor}
    //       backgroundColor="transparent"
    //       // barStyle="light-content"
    //       // barStyle={
    //       //   // Platform.OS === 'ios'
    //       //   settings.isThemeDark ? 'light-content' : 'dark-content'
    //       //   // : 'light-content'
    //       // }
    //     />
    //     <Button title="Hello" onPress={handlePresentModalPress}></Button>
    //     <BottomSheetModal
    //       ref={bottomSheetModalRef}
    //       index={1}
    //       snapPoints={snapPoints}
    //       // onChange={handleSheetChanges}
    //       backdropComponent={renderBackdrop}
    //     >
    //       <View style={{ flex: 1, padding: 24 }}>
    //         <Text>Awesome 🎉</Text>
    //       </View>
    //     </BottomSheetModal>
    //   </View>
    // </BottomSheetModalProvider>

    <RecoilRoot>
      <Suspense fallback={<LoadingComponent />}>
        <BaseScreen />
      </Suspense>
    </RecoilRoot>
  );
};
export default App;
