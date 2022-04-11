/* eslint-disable arrow-body-style */
/* eslint-disable no-undef */
import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, TextInput, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import CustomIconButton from '../../components/CustomIconButton';
import { launcherIDsState, settingsState } from '../../recoil/Atoms';
import { api } from '../../services/Api';

const FarmerNameScreen = ({ route, navigation }) => {
  const [farms, setLauncherIDs] = useRecoilState(launcherIDsState);
  const [settings, setSettings] = useRecoilState(settingsState);
  const { t } = useTranslation();
  const { launcherId, token, name } = route.params;
  const [farmerName, setFarmerName] = useState(name);
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
          <CustomIconButton
            icon={<Ionicons name="ios-save-outline" size={24} color={theme.colors.textGrey} />}
            style={{ marginEnd: 20 }}
            color="#fff"
            size={24}
            onPress={() => {
              api({
                method: 'put',
                url: `launcher/${launcherId}/`,
                body: { name: farmerName },
                headers: { Authorization: `Bearer ${token}` },
              })
                .then(() => {
                  const updatedList = farms.map((item) => {
                    return item.launcherId === launcherId ? { ...item, name: farmerName } : item;
                  });
                  setLauncherIDs(updatedList);
                })
                .catch((ex) => {
                  console.log(ex);
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
      <View style={{ alignSelf: 'stretch', margin: 16 }}>
        {/* <Text style={{ paddingBottom: 4, fontFamily: theme.fonts.medium.fontFamily, fontSize: 12 }}>
          Name
        </Text> */}
        <Shadow
          distance={2}
          startColor="rgba(0, 0, 0, 0.02)"
          radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
          viewStyle={{ alignSelf: 'stretch' }}
        >
          <View
            style={{
              // marginTop: 24,
              padding: 8,
              paddingStart: 16,
              paddingEnd: 16,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.colors.onSurfaceLight,
              borderColor: theme.colors.borderColor,
              borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
              // margin: 16,
            }}
          >
            {/* <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: theme.colors.textGrey,
                marginEnd: 16,
              }}
            >
              Name
            </Text> */}
            <TextInput
              placeholderTextColor={theme.colors.textGreyLight}
              style={{ flex: 1, color: theme.colors.text, fontSize: 18 }}
              mode="flat"
              onChangeText={(text) => {
                setFarmerName(text);
              }}
              value={farmerName}
              // placeholder={farmerName}
              keyboardType="default"
            />
          </View>
        </Shadow>
      </View>
    </SafeAreaView>
  );
};
export default FarmerNameScreen;
