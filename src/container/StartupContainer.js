import React, { useEffect } from 'react';
import { ActivityIndicator, View, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, Text } from 'react-native-paper';
import { getObject } from '../utils/Utils';

const StartupContainer = ({ navigation }) => {
  const { setIsThemeDark } = useTheme();

  const { t } = useTranslation();

  const init = async () => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 2000)
    );
    const theme = await getObject('theme');
    setIsThemeDark(() => theme);
    navigation.navigate('Root');
  };

  useEffect(() => {
    init();
  });

  return (
    <SafeAreaView>
      <Text>{t('welcome')}</Text>
    </SafeAreaView>
  );
};

export default StartupContainer;
