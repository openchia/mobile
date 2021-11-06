import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View } from 'react-native';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { getNetspace } from '../Api';
import LoadingComponent from '../components/LoadingComponent';
import { netSpaceRequestIDState } from '../Atoms';
import AreaChartNetspace from '../charts/AreaChartNetspace';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(netSpaceRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const netspaceQuery = selectorFamily({
  key: 'netspaceSelector',
  get:
    () =>
    async ({ get }) => {
      get(netSpaceRequestIDState());
      const response = await getNetspace();
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const NetspaceScreen = ({ navigation }) => {
  const netspace = useRecoilValue(netspaceQuery());

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AreaChartNetspace data={netspace} />
      {/* <InteractiveChart /> */}
    </SafeAreaView>
  );
};

export default NetspaceScreen;
