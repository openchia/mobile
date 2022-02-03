import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Linking, SafeAreaView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PressableCard from '../../components/PressableCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Item = ({ item, color, t, onPress, theme }) => (
  <PressableCard
    style={{
      marginBottom: 2,
      paddingTop: 16,
      paddingBottom: 16,
    }}
    onPress={onPress}
  >
    <View style={{ marginHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
      {item.icon}
      <Text style={{ paddingLeft: 24 }}>{item.name}</Text>
    </View>
    {/* </View> */}
  </PressableCard>
);

const MoreScreen = ({ navigation }) => {
  const x = 0;
  const theme = useTheme();
  const { t } = useTranslation();

  const items = [
    {
      name: 'Giveaway',
      navigateTo: 'Giveaway',
      icon: <Ionicons name="gift" size={24} color={theme.colors.textGreyLight} />,
    },
    {
      name: 'Settings',
      navigateTo: 'Settings',
      icon: <Ionicons name="settings" size={24} color={theme.colors.textGreyLight} />,
    },
    {
      name: 'Join our Community',
      // navigateTo: 'Settings',
      url: 'https://discord.com/invite/2URS9H7RZn',
      icon: <MaterialCommunityIcons name="discord" size={24} color={theme.colors.textGreyLight} />,
    },
  ];

  const renderItem = ({ item }) => (
    <Item
      item={item}
      color={theme.colors.textGrey}
      theme={theme}
      t={t}
      onPress={() => {
        if (item.url) {
          Linking.canOpenURL(item.url).then((supported) => {
            if (supported) {
              Linking.openURL(item.url);
            } else {
              Alert.alert(`Don't know how to open this URL: ${item.url}`);
            }
          });
        } else navigation.navigate(item.navigateTo);
      }}
    />
  );

  return (
    <SafeAreaView
      style={{
        marginTop: 2,
        flex: 1,
      }}
    >
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default MoreScreen;
