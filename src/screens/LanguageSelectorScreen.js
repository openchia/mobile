import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import PressableCard from '../components/PressableCard';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'cs', label: 'Čeština' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'hu', label: 'Magyar' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'pt', label: 'Português' },
  { code: 'nl', label: 'Nederlands' },
];

const Item = ({ item, onPress }) => (
  <PressableCard style={{ marginBottom: 1, paddingTop: 12, paddingBottom: 12 }} onPress={onPress}>
    <View
      style={{
        marginHorizontal: 12,
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Text style={styles.label}>{item.label}</Text>
    </View>
  </PressableCard>
);
const LanguageSelectorScreen = () => {
  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;
  const navigation = useNavigation();
  const theme = useTheme();

  const setLanguage = (code) => i18n.changeLanguage(code);

  const renderItem = useCallback(
    ({ item, index }) => (
      <Item
        item={item}
        theme={theme}
        onPress={() => {
          if (item.code !== selectedLanguageCode) {
            setLanguage(item.code);
            navigation.goBack();
          }
        }}
      />
    ),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.divider }}>
      <FlatList
        initialNumToRender={LANGUAGES.length - 1}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={<View style={{}} />}
        data={LANGUAGES.sort((a, b) => a.label.localeCompare(b.label)).filter(
          (item) => selectedLanguageCode !== item.code
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.code.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  itemNotSelected: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default LanguageSelectorScreen;
