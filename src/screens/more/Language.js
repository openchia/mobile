import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import PressableCard from '../../components/PressableCard';

// export const LANGUAGES = [
//   { code: 'en', label: 'English' },
//   { code: 'cs', label: 'Čeština' },
//   { code: 'fr', label: 'Français' },
//   { code: 'de', label: 'Deutsch' },
//   { code: 'es', label: 'Español' },
//   { code: 'hu', label: 'Magyar' },
//   { code: 'pl', label: 'Polski' },
//   { code: 'ru', label: 'Русский' },
//   { code: 'zh', label: '中文' },
//   { code: 'pt', label: 'Português' },
//   { code: 'nl', label: 'Nederlands' },
// ];

export const LANGUAGES = [
  {
    code: 'af-ZA',
    label: 'Afrikaans',
  },
  {
    code: 'ar-SA',
    label: 'العربية',
  },
  {
    code: 'ca-ES',
    label: 'Català',
  },
  {
    code: 'cs-CZ',
    label: 'Čeština',
  },
  {
    code: 'da-DK',
    label: 'Dansk',
  },
  {
    code: 'de-DE',
    label: 'Deutsch',
  },
  {
    code: 'el-GR',
    label: 'ελληνικά',
  },
  {
    code: 'en-US',
    label: 'English',
  },
  {
    code: 'es-ES',
    label: 'Español',
  },
  {
    code: 'fi-FI',
    label: 'Suomi',
  },
  {
    code: 'fr-FR',
    label: 'Français',
  },
  {
    code: 'he-IL',
    label: 'עברית',
  },
  {
    code: 'hu-HU',
    label: 'Magyar',
  },
  {
    code: 'it-IT',
    label: 'Italiano ',
  },
  {
    code: 'ja-JP',
    label: '日本語',
  },
  {
    code: 'ko-KR',
    label: '한국어',
  },
  {
    code: 'nl-NL',
    label: 'Nederlands',
  },
  {
    code: 'no-NO',
    label: 'Norsk',
  },
  {
    code: 'pl-PL',
    label: 'Język Polski',
  },
  {
    code: 'pt-BR',
    label: 'Português Brasil',
  },
  {
    code: 'pt-PT',
    label: 'Português',
  },
  {
    code: 'ro-RO',
    label: 'Română',
  },
  {
    code: 'ru-RU',
    label: 'Русский',
  },
  {
    code: 'sr-SP',
    label: 'српски / srpski',
  },
  {
    code: 'sv-SE',
    label: 'Svenska',
  },
  {
    code: 'tr-TR',
    label: 'Türkçe',
  },
  {
    code: 'uk-UA',
    label: 'Українська',
  },
  {
    code: 'vi-VN',
    label: 'Tiếng Việt',
  },
  {
    code: 'zh-CN',
    label: '简体中文',
  },
  {
    code: 'zh-TW',
    label: '繁體中文',
  },
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
  const navigation = useNavigation();
  const theme = useTheme();

  const setLanguage = (code) => i18n.changeLanguage(code);

  const renderItem = useCallback(
    ({ item, index }) => (
      <Item
        item={item}
        theme={theme}
        onPress={() => {
          if (item.code !== i18n.language) {
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
          (item) => i18n.language !== item.code
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
