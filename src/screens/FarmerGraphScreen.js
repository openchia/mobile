import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getNetspace } from '../Api';
import LoadingComponent from '../components/LoadingComponent';

const FarmerGraphScreen = ({ navigation }) => (
  <LoadingComponent />
  // <SafeAreaView>
  // </SafeAreaView>
);

export default FarmerGraphScreen;
