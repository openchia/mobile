import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomCard from '../components/CustomCard';
import PressableCard from '../components/PressableCard';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'hu', label: 'Magyar' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: 'Русский' },
  { code: 'cs', label: 'Čeština' },
];

const Item = ({ item, selected, onPress }) => {
  if (selected) {
    return (
      <CustomCard
        style={{
          padding: 14,
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
        }} // style={([styles.item], { backgroundColor: 'rgba(219, 219, 219, 0.6)' })}
        // selected
        // onPress={onPress}
      >
        <Text style={styles.label}>{item.label}</Text>
      </CustomCard>
    );
  }
  return (
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
};

const LanguageSelectorScreen = () => {
  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;
  const navigation = useNavigation();

  const setLanguage = (code) => i18n.changeLanguage(code);

  const renderItem = ({ item, index }) => (
    <Item
      item={item}
      selected={selectedLanguageCode === item.code}
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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
        data={LANGUAGES.sort((a, b) => a.label.localeCompare(b.label))}
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
    // backgroundColor: '#fff',
    // padding: 14,
    // paddingEnd: 20,
    // marginVertical: 8,
    // borderRadius: 8,
    // marginHorizontal: 16,
    // borderColor: '#fff', // if you need
    // borderWidth: 1,
    // overflow: 'hidden',
    // shadowColor: '#000',
    // shadowRadius: 10,
    // shadowOpacity: 1,
    // elevation: 6,
    display: 'flex',
    flexDirection: 'row',
  },
  itemNotSelected: {
    // backgroundColor: '#dbdbdb',
    // padding: 14,
    // paddingEnd: 20,
    // marginVertical: 8,
    // borderRadius: 8,
    // marginHorizontal: 16,
    // borderColor: '#c9c9c9', // if you need
    // borderWidth: 1,
    // overflow: 'hidden',
    // shadowColor: '#000',
    // shadowRadius: 10,
    // shadowOpacity: 1,
    // elevation: 6,
    display: 'flex',
    flexDirection: 'row',
  },
});

export default LanguageSelectorScreen;
