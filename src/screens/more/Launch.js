import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useWindowDimensions, View } from 'react-native';
import { RadioButton, Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomCard from '../../components/CustomCard';
import PressableCard from '../../components/PressableCard';
import { currencyState, settingsState } from '../../recoil/Atoms';

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

const LaunchOptionScreen = ({ navigation }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [settings, setSettings] = useRecoilState(settingsState);
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'screenNames' });

  const selectedLanguageCode = i18n.language;
  const currency = useRecoilValue(currencyState);

  const toggleActiveFarmers = () => {
    setSettings((prev) => ({ ...prev, showOnlyActiveFarmers: !prev.showOnlyActiveFarmers }));
  };

  return (
    <SafeAreaView
      style={{
        // marginTop: 2,
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={{ padding: 16, marginTop: 16 }}>
        <Shadow
          distance={2}
          startColor="rgba(0, 0, 0, 0.02)"
          // finalColor="rgba(0, 0, 0, 0.01)"
          // containerViewStyle={{ marginVertical: 16 }}
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
                setSettings((prev) => ({ ...prev, intialRoute: 'Home' }));
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  style={{ paddingLeft: 16 }}
                  name="home"
                  size={24}
                  color={theme.colors.textGrey}
                />
                <Text style={{ paddingLeft: 16, flex: 1 }}>{t('home')}</Text>
                <View style={{ paddingRight: 16 }}>
                  <RadioButton
                    style={{ paddingRight: 16 }}
                    value="Home"
                    status={settings.intialRoute === 'Home' ? 'checked' : 'unchecked'}
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
              onPress={() => setSettings((prev) => ({ ...prev, intialRoute: 'Dashboard' }))}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  style={{ paddingLeft: 16 }}
                  name="view-dashboard"
                  size={24}
                  color={theme.colors.textGrey}
                />
                <Text style={{ paddingLeft: 16, flex: 1 }}>{t('dashboard')}</Text>
                <View style={{ paddingRight: 16 }}>
                  <RadioButton
                    style={{ paddingRight: 16 }}
                    value="Dashboard"
                    status={settings.intialRoute === 'Dashboard' ? 'checked' : 'unchecked'}
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
              onPress={() => setSettings((prev) => ({ ...prev, intialRoute: 'News' }))}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  style={{ paddingLeft: 16 }}
                  name="ios-newspaper"
                  size={24}
                  color={theme.colors.textGrey}
                />
                <Text style={{ paddingLeft: 16, flex: 1 }}>{t('news')}</Text>
                <View style={{ paddingRight: 16 }}>
                  <RadioButton
                    value="News"
                    status={settings.intialRoute === 'News' ? 'checked' : 'unchecked'}
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

export default LaunchOptionScreen;
