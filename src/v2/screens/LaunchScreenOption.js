import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, SafeAreaView, useWindowDimensions, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import messaging from '@react-native-firebase/messaging';
import { RadioButton, Switch, Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currencyState, settingsState } from '../../Atoms';
import CustomIconButton from '../../components/CustomIconButton';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import PressableCard from '../../components/PressableCard';
import DiscordIcon from '../../images/DiscordIcon';
import OpenChiaTextIconRight from '../../images/OpenChiaTextIconRight';
import CustomCard from './../../components/CustomCard';
import { getCurrencyFromKey, getCurrencyTitle } from '../../screens/CurrencySelectionScreen';
import { LANGUAGES } from '../../screens/LanguageSelectorScreen';
import { ScrollView } from 'react-native-gesture-handler';

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
  const { t, i18n } = useTranslation();
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
      <DropShadow
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          marginVertical: 24,
          marginHorizontal: 16,
        }}
      >
        <CustomCard style={{ borderRadius: 16, backgroundColor: theme.colors.onSurfaceLight }}>
          <PressableCard
            style={{
              paddingTop: 16,
              paddingBottom: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: theme.colors.onSurfaceLight,
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
          <View style={{ height: 0.8, backgroundColor: theme.colors.background }} />
          <PressableCard
            style={{
              paddingTop: 16,
              paddingBottom: 16,
              backgroundColor: theme.colors.onSurfaceLight,
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
          <View style={{ height: 0.8, backgroundColor: theme.colors.background }} />
          <PressableCard
            style={{
              paddingTop: 16,
              paddingBottom: 16,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
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
      </DropShadow>
    </SafeAreaView>
  );
};

export default LaunchOptionScreen;
