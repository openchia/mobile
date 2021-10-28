import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View } from 'react-native';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace } from '../Api';
import LoadingWrapper from '../components/LoadingWrapper';

const HomeScreen = ({ navigation }) => (
  <LoadingWrapper>
    {/* <Text>Welcome to OpenChia.io</Text> */}
    {/* {isLoading ? <ActivityIndicator /> : <AreaChartNetspace data={data} />} */}
  </LoadingWrapper>
);

export default HomeScreen;
