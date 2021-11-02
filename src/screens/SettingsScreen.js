import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, View } from 'react-native';
import { Card, useTheme, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace } from '../Api';
import LoadingComponent from '../components/LoadingComponent';
import CustomCard from '../components/CustomCard';
import { LANGUAGES } from './LanguageSelectorScreen';

const SettingsScreen = ({ navigation }) => {
  // const theme = useTheme();
  // const LeftContent = (props) => <Text style={{ marginEnd: 16 }}>test</Text>;
  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;

  return (
    <SafeAreaView
      style={{
        paddingTop: 16,
        flex: 1,
      }}
    >
      <CustomCard
        title="Currency"
        subtitle="Set preferred currency."
        desc="USD"
        style={{
          marginLeft: 12,
          marginEnd: 12,
          // borderRadius: 10,
        }}
        // onPress={() => navigation.navigate('CurrencySelection')}
      />
      <CustomCard
        title="Language"
        subtitle="Set preferred language."
        desc={LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
        style={{
          marginLeft: 12,
          marginEnd: 12,
          // borderRadius: 10,
        }}
        onPress={() => navigation.navigate('Language')}
      />
    </SafeAreaView>
  );
};
export default SettingsScreen;
