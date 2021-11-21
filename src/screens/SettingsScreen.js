import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, View, StyleSheet } from 'react-native';
import { Card, useTheme, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { LANGUAGES } from './LanguageSelectorScreen';
import CustomCard from '../components/CustomCard';
import { currencyState } from '../Atoms';
import PressableCard from '../components/PressableCard';

const SettingsScreen = ({ navigation }) => {
  // const theme = useTheme();
  // const LeftContent = (props) => <Text style={{ marginEnd: 16 }}>test</Text>;
  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;
  const currency = useRecoilValue(currencyState);

  return (
    <SafeAreaView
      style={{
        paddingTop: 8,
        flex: 1,
      }}
    >
      <PressableCard
        onPress={() => navigation.navigate(`${t('common:currency')}`)}
        // style={{
        //   padding: 16,
        //   display: 'flex',
        //   flexDirection: 'row',
        //   alignItems: 'center',
        // }}
      >
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('common:currency')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('common:currencyDesc')}
              {/* Set preferred currency. */}
            </Text>
          </View>
          <Text style={styles.desc}>{currency.toUpperCase()}</Text>
        </View>
      </PressableCard>
      <PressableCard
        onPress={() => navigation.navigate(`${t('common:language')}`)}
        // style={{
        //   padding: 16,
        //   display: 'flex',
        //   flexDirection: 'row',
        //   alignItems: 'center',
        // }}
      >
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{t('common:language')}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {t('common:languageDesc')}
            </Text>
          </View>
          <Text style={styles.desc}>
            {LANGUAGES.filter((item) => item.code === selectedLanguageCode)[0].label}
          </Text>
        </View>
      </PressableCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
  },
  desc: {
    fontSize: 12,
  },
});

export default SettingsScreen;
