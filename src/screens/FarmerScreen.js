import React, { Suspense, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { selectorFamily, useRecoilValue } from 'recoil';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace, getFarmers } from '../Api';
import { formatBytes } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';

const FarmerScreen = ({ navigation }) => (
  <SafeAreaView>
    <Text>Hello</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderColor: '#fff', // if you need
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 6,
    display: 'flex',
    flexDirection: 'row',
  },
  rank: {
    fontSize: 14,
    marginEnd: 20,
  },
  name: {
    fontSize: 14,
    marginEnd: 20,
    color: '#407538',
    flex: 1,
  },
  size: {
    marginLeft: 'auto',
    fontSize: 14,
  },
});

export default FarmerScreen;
