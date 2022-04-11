import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, TextInput, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { groupState, settingsState } from '../../Atoms';
import IconButton from '../../components/IconButton';

const CreateGroupScreen = ({ route, navigation }) => {
  const [groups, setGroups] = useRecoilState(groupState);
  const [title, setTitle] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();

  const [settings, setSettings] = useRecoilState(settingsState);

  const updateName = (title) => {
    setSettings((prev) => ({ ...prev, groupName: title }));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginEnd: -12,
            alignItems: 'center',
          }}
        >
          <IconButton
            icon={<Ionicons name="ios-save-outline" size={24} color="white" />}
            style={{ marginEnd: 20 }}
            color="#fff"
            size={24}
            onPress={() => {
              if (title !== '') {
                updateName(title);
                // setGroups((prev) => [...prev, { title, farms: [] }]);
                navigation.goBack();
              } else {
                console.log(title);
              }
            }}
          />
        </View>
      ),
    });
  }, [navigation, title]);

  return (
    <SafeAreaView>
      <View
        style={{
          marginTop: 24,
          padding: 8,
          paddingStart: 16,
          paddingEnd: 16,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.onSurface,
          borderColor: theme.colors.borderColor,
        }}
      >
        <Text
          style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.textGrey, marginEnd: 16 }}
        >
          Name
        </Text>
        <TextInput
          placeholderTextColor={theme.colors.textGreyLight}
          style={{ flex: 1, color: theme.colors.text, fontSize: 18 }}
          mode="flat"
          onChangeText={(text) => {
            setTitle(text);
          }}
          value={title}
          placeholder="Set group title"
          keyboardType="default"
        />
      </View>
    </SafeAreaView>
  );
};
export default CreateGroupScreen;
