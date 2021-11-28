import { useNavigation } from '@react-navigation/native';
import React from 'react';
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
];

const Item = ({ item, onPress }) => (
  <PressableCard onPress={onPress}>
    <View
      style={{
        padding: 14,
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

  const renderItem = ({ item, index }) => (
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
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        initialNumToRender={LANGUAGES.length - 1}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
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
