import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useTranslation } from 'react-i18next';
import { TouchableRipple } from 'react-native-paper';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
];

const Item = ({ item, selected, onPress }) => {
  if (selected) {
    return (
      <TouchableRipple
        borderless
        style={[styles.item, { backgroundColor: '#cccccc', borderColor: '#000' }]}
        onPress={onPress}
      >
        <Text style={[styles.label, { color: '#000' }]}>{item.label}</Text>
      </TouchableRipple>
    );
  }
  return (
    <TouchableRipple borderless style={[styles.item]} onPress={onPress}>
      <Text style={styles.label}>{item.label}</Text>
    </TouchableRipple>
  );
};

const LanguageSelectorScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;

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
    <SafeAreaView>
      <FlatList
        data={LANGUAGES}
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
    backgroundColor: '#fff',
    padding: 14,
    paddingEnd: 20,
    marginVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
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
});

export default LanguageSelectorScreen;
