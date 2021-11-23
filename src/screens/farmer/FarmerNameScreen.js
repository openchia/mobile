import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView, View, TextInput } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import IconButton from '../../components/IconButton';
import { updateFarmerName } from '../../Api';
import { launcherIDsState } from '../../Atoms';

const FarmerNameScreen = ({ route, navigation }) => {
  const [farmerName, setFarmerName] = useState(null);
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const { t } = useTranslation();
  const { launcherId, token, name } = route.params;
  const theme = useTheme();

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
              console.log(launcherIDs);
              updateFarmerName(launcherId, token, farmerName)
                .then(() => {
                  setLauncherIDs(
                    (prev) =>
                      new Map(
                        prev.set(launcherId, {
                          name: farmerName,
                          token,
                        })
                      )
                  );
                })
                .finally(() => {
                  navigation.goBack();
                });
            }}
          />
        </View>
      ),
    });
  }, [navigation, farmerName]);

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
            setFarmerName(text);
          }}
          value={farmerName}
          placeholder={name}
          keyboardType="default"
        />
      </View>
    </SafeAreaView>
  );
};
export default FarmerNameScreen;
