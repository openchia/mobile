import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useWindowDimensions, View } from 'react-native';
import { RadioButton, Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomCard from '../../../components/CustomCard';
import PressableCard from '../../../components/PressableCard';
import { currencyState, launcherIDsState, settingsState } from '../../../recoil/Atoms';
import { api } from '../../../services/Api';

const Item = ({ item, color, t, onPress, theme }) => (
  <PressableCard
    style={{
      // marginBottom: 2,
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

const DifficultyScreen = ({ navigation, route }) => {
  const [farms, setLauncherIDs] = useRecoilState(launcherIDsState);
  const [settings, setSettings] = useRecoilState(settingsState);
  const { t } = useTranslation();
  const { launcherId, token, defaultDifficulty } = route.params;
  const [difficulty, setDifficulty] = useState(defaultDifficulty || 'DEFAULT');
  const theme = useTheme();

  const onPress = (difficulty) => {
    setDifficulty(difficulty);
    api({
      method: 'put',
      url: `launcher/${launcherId}/`,
      body: { custom_difficulty: difficulty === 'DEFAULT' ? null : difficulty },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        const updatedList = farms.map((item) =>
          item.launcherId === launcherId
            ? { ...item, custom_difficulty: difficulty === 'DEFAULT' ? null : difficulty }
            : item
        );
        setLauncherIDs(updatedList);
      })
      .catch((ex) => {
        console.log(ex);
      });
    // .finally(() => {
    //   navigation.goBack();
    // });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={{ padding: 16, marginTop: 16 }}>
        <Shadow
          distance={2}
          startColor="rgba(0, 0, 0, 0.02)"
          radius={16}
          viewStyle={{ alignSelf: 'stretch' }}
        >
          <CustomCard style={{ borderRadius: 16, backgroundColor: theme.colors.background }}>
            <PressableCard
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                borderTopLeftRadius: settings.sharpEdges
                  ? theme.tileModeRadius
                  : theme.roundModeRadius,
                borderTopRightRadius: settings.sharpEdges
                  ? theme.tileModeRadius
                  : theme.roundModeRadius,
                backgroundColor: theme.colors.onSurfaceLight,
                marginBottom: 1,
              }}
              onPress={() => {
                onPress('LOWEST');
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ paddingLeft: 16, flex: 1 }}>{t('lowest')}</Text>
                <View style={{ paddingRight: 16 }}>
                  <RadioButton
                    style={{ paddingRight: 16 }}
                    value="Home"
                    status={difficulty === 'LOWEST' ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </PressableCard>
            <PressableCard
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: theme.colors.onSurfaceLight,
                marginBottom: 1,
              }}
              onPress={() => {
                onPress('LOW');
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ paddingLeft: 16, flex: 1 }}>{t('low')}</Text>
                <View style={{ paddingRight: 16 }}>
                  <RadioButton
                    style={{ paddingRight: 16 }}
                    value="Dashboard"
                    status={difficulty === 'LOW' ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </PressableCard>
            <PressableCard
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: theme.colors.onSurfaceLight,
                marginBottom: 1,
              }}
              onPress={() => {
                onPress('DEFAULT');
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ paddingLeft: 16, flex: 1 }}>{t('default')}</Text>
                <View style={{ paddingRight: 16 }}>
                  <RadioButton
                    style={{ paddingRight: 16 }}
                    value="Dashboard"
                    status={difficulty === 'DEFAULT' ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </PressableCard>
            <PressableCard
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: theme.colors.onSurfaceLight,
                marginBottom: 1,
              }}
              onPress={() => {
                onPress('HIGH');
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ paddingLeft: 16, flex: 1 }}>{t('high')}</Text>
                <View style={{ paddingRight: 16 }}>
                  <RadioButton
                    style={{ paddingRight: 16 }}
                    value="Dashboard"
                    status={difficulty === 'HIGH' ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </PressableCard>
            <PressableCard
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                borderBottomLeftRadius: settings.sharpEdges
                  ? theme.tileModeRadius
                  : theme.roundModeRadius,
                borderBottomRightRadius: settings.sharpEdges
                  ? theme.tileModeRadius
                  : theme.roundModeRadius,
                backgroundColor: theme.colors.onSurfaceLight,
              }}
              onPress={() => {
                onPress('HIGHEST');
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ paddingLeft: 16, flex: 1 }}>{t('highest')}</Text>
                <View style={{ paddingRight: 16 }}>
                  <RadioButton
                    value="News"
                    status={difficulty === 'HIGHEST' ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </PressableCard>
          </CustomCard>
        </Shadow>
      </View>
    </SafeAreaView>
  );
};

export default DifficultyScreen;
