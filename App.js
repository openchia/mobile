import React, { Node, useCallback, useMemo, useState, Suspense, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { RecoilRoot } from 'recoil';
import ApplicationNavigator from './src/ApplicationNavigator';
import LoadingComponent from './src/components/LoadingComponent';
import './src/constants/IMLocalize';

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/fr-BE');
  require('intl/locale-data/jsonp/nl-BE');
  require('intl/locale-data/jsonp/it-IT');
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
}
const App = () => (
  <RecoilRoot>
    <Suspense fallback={<LoadingComponent />}>
      <ApplicationNavigator />
      <View />
    </Suspense>
  </RecoilRoot>
);

export default App;
