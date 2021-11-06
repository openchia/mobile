import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getNetspace } from '../Api';
import LoadingComponent from '../components/LoadingComponent';

const HomeScreen = ({ navigation }) => (
  <LoadingComponent />
  // <SafeAreaView>
  // </SafeAreaView>
);

export default HomeScreen;
