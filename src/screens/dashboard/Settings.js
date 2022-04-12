/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Switch, Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import LoadingComponent from '../../components/LoadingComponent';
import PressableCard from '../../components/PressableCard';
import { launcherIDsState, settingsState } from '../../recoil/Atoms';
import { api } from '../../services/Api';
import { convertMojoToChia } from '../../utils/Formatting';

const Content = ({ navigation, route }) => {
  const theme = useTheme();
  const [settings, setSettings] = useRecoilState(settingsState);
  const { t, i18n } = useTranslation();
  const { farm } = route.params;
  const [farms, setFarms] = useRecoilState(launcherIDsState);
  const [loading, setLoading] = useState(true);

  const data = farms.find((item) => item.launcherId === farm.launcherId);
  // const [data, setData] = useState();

  const handleError = useErrorHandler();

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    const fetchData = async () => {
      const response = await api(
        { url: `launcher/${farm.launcherId}/`, headers: { Authorization: `Bearer ${farm.token}` } },
        controller.signal
      ).catch((err) => {
        handleError(err);
      });

      if (response) {
        // setData(response);
        const updatedList = farms.map((item) => {
          return item.launcherId === farm.launcherId
            ? {
                ...item,
                name: response.name,
                email: response.email,
                difficulty: response.custom_difficulty,
                payment: response.payment,
                minimumPayout: response.minimum_payout,
                sizeDrop: response.size_drop,
                sizeDropPercent: response.size_drop_percent,
                sizeDropInterval: response.size_drop_interval,
                referrer: response.referrer,
              }
            : item;
        });
        setFarms(updatedList);
      }
      setLoading(false);
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  // const data = datas.find((item) => item.launcher_id === launcherId);
  // console.log(data, launcherId);

  const toggle = (webType, type) => {
    const updatedList = farms.map((item) => {
      if (item.launcherId === farm.launcherId) {
        let data = Object.prototype.hasOwnProperty.call(item, `${type}`) ? [...item[type]] : [];
        if (data.includes('PUSH')) {
          data = data.filter((item) => item !== 'PUSH');
        } else {
          data.push('PUSH');
        }
        return {
          ...item,
          [type]: data,
        };
      }
      return item;
    });

    console.log(updatedList);

    api({
      method: 'put',
      url: `launcher/${farm.launcherId}/`,
      body: { [webType]: updatedList.find((item) => item.launcherId === farm.launcherId)[type] },
      headers: { Authorization: `Bearer ${farm.token}` },
    })
      .then(() => {})
      .catch((ex) => {
        console.log(ex);
      });

    setFarms(updatedList);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <LoadingComponent />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={{ alignSelf: 'stretch', margin: 16 }}>
          <Text
            style={{ paddingBottom: 4, fontFamily: theme.fonts.medium.fontFamily, fontSize: 12 }}
          >
            General
          </Text>
          <Shadow
            distance={2}
            startColor="rgba(0, 0, 0, 0.02)"
            radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
            viewStyle={{ alignSelf: 'stretch' }}
          >
            <View
              style={[
                {
                  marginVertical: 0,
                  backgroundColor: theme.colors.background,
                  borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
                },
              ]}
            >
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
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
                  navigation.navigate({
                    name: 'Settings Component',
                    params: {
                      launcherId: farm.launcherId,
                      token: farm.token,
                      defaultData: data.name,
                      type: 'name',
                      title: 'Name',
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16 }}>{t('displayName')}</Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: 'right',
                      flex: 1,
                      paddingLeft: 16,
                      paddingRight: 16,
                      color: theme.colors.textGrey,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {data.name || 'None'}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 16 }}
                    name="chevron-forward-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  backgroundColor: theme.colors.onSurfaceLight,
                  marginBottom: 1,
                }}
                onPress={() => {
                  navigation.navigate({
                    name: 'Settings Component',
                    params: {
                      launcherId: farm.launcherId,
                      token: farm.token,
                      defaultData: data.email,
                      type: 'email',
                      title: 'Email',
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16 }}>{t('email')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        textAlign: 'right',
                        flex: 1,
                        paddingLeft: 16,
                        paddingRight: 16,
                        color: theme.colors.textGrey,
                        fontFamily: theme.fonts.medium.fontFamily,
                      }}
                    >
                      {data.email || 'None'}
                    </Text>
                    <Ionicons
                      style={{ paddingRight: 16 }}
                      name="chevron-forward-outline"
                      size={24}
                      color={theme.colors.text}
                    />
                  </View>
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderBottomLeftRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  borderBottomRightRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  backgroundColor: theme.colors.onSurfaceLight,
                }}
                onPress={() => {
                  navigation.navigate({
                    name: 'Difficulty Setting',
                    params: {
                      launcherId: farm.launcherId,
                      token: farm.token,
                      defaultDifficulty: data.difficulty,
                      title: 'Difficulty',
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>{t('difficulty')}</Text>
                  <Text
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      color: theme.colors.textGrey,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {data.difficulty || 'Default'}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 16 }}
                    name="chevron-forward-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </PressableCard>
            </View>
          </Shadow>
        </View>

        <View style={{ alignSelf: 'stretch', margin: 16 }}>
          <Text
            style={{ paddingBottom: 4, fontFamily: theme.fonts.medium.fontFamily, fontSize: 12 }}
          >
            Payments
          </Text>
          <Shadow
            distance={2}
            startColor="rgba(0, 0, 0, 0.02)"
            radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
            viewStyle={{ alignSelf: 'stretch' }}
          >
            <View
              style={[
                {
                  marginVertical: 0,
                  backgroundColor: theme.colors.background,
                  borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
                },
              ]}
            >
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
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
                  toggle('payment', 'payment');
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>
                    {data.payment.includes('PUSH')
                      ? t('paymentOffNotification')
                      : t('paymentOnNotification')}
                  </Text>
                  <View pointerEvents="none" style={{ paddingRight: 16 }}>
                    <Switch
                      value={data.payment ? data.payment.includes('PUSH') : false}
                      trackColor={{ true: theme.colors.accentLight, false: 'rgba(0, 0, 0, 0.4)' }}
                    />
                  </View>
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderBottomLeftRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  borderBottomRightRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  backgroundColor: theme.colors.onSurfaceLight,
                }}
                onPress={() => {
                  navigation.navigate({
                    name: 'Min Payout Setting',
                    params: {
                      launcherId: data.launcherId,
                      token: data.token,
                      minimumPayout: data.minimumPayout,
                      title: t('minPayoutSet'),
                      keyboardType: 'numeric',
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>{t('minPayoutSet')}</Text>
                  <Text
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      color: theme.colors.textGrey,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {data.minimumPayout === 0
                      ? 'None'
                      : `${convertMojoToChia(data.minimumPayout)} XCH`}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 16 }}
                    name="chevron-forward-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </PressableCard>
            </View>
          </Shadow>
        </View>

        <View style={{ alignSelf: 'stretch', margin: 16 }}>
          <Text
            style={{ paddingBottom: 4, fontFamily: theme.fonts.medium.fontFamily, fontSize: 12 }}
          >
            Farm
          </Text>
          <Shadow
            distance={2}
            startColor="rgba(0, 0, 0, 0.02)"
            radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
            viewStyle={{ alignSelf: 'stretch' }}
          >
            <View
              style={[
                {
                  marginVertical: 0,
                  backgroundColor: theme.colors.background,
                  borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
                },
              ]}
            >
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
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
                  toggle('size_drop', 'sizeDrop');
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>
                    {data.sizeDrop.includes('PUSH')
                      ? t('sizeDropOffNotification')
                      : t('sizeDropOnNotification')}
                  </Text>
                  <View pointerEvents="none" style={{ paddingRight: 16 }}>
                    <Switch
                      value={data.sizeDrop ? data.sizeDrop.includes('PUSH') : false}
                      trackColor={{ true: theme.colors.accentLight, false: 'rgba(0, 0, 0, 0.4)' }}
                    />
                  </View>
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  backgroundColor: theme.colors.onSurfaceLight,
                  marginBottom: 1,
                }}
                onPress={() => {
                  navigation.navigate({
                    name: 'Size Drop Setting',
                    params: {
                      launcherId: farm.launcherId,
                      token: farm.token,
                      defaultVal: data.sizeDropPercent ? data.sizeDropPercent : 25,
                      title: t('sizeDropPercent'),
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>{t('sizeDropPercent')}</Text>
                  <Text
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      color: theme.colors.textGrey,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {data.sizeDropPercent ? `${data.sizeDropPercent}%` : '25%'}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 16 }}
                    name="chevron-forward-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </PressableCard>
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderBottomLeftRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  borderBottomRightRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  backgroundColor: theme.colors.onSurfaceLight,
                }}
                onPress={() => {
                  navigation.navigate({
                    name: 'Size Drop Interval',
                    params: {
                      launcherId: farm.launcherId,
                      token: farm.token,
                      sizeDropInterval: data.sizeDropInterval ? data.sizeDropInterval : 60,
                      title: t('sizeDropInterval'),
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16, flex: 1 }}>{t('sizeDropInterval')}</Text>
                  <Text
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      color: theme.colors.textGrey,
                      fontFamily: theme.fonts.medium.fontFamily,
                    }}
                  >
                    {data.sizeDropInterval ? `${data.sizeDropInterval} min` : '60 min'}
                  </Text>
                  <Ionicons
                    style={{ paddingRight: 16 }}
                    name="chevron-forward-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </PressableCard>
            </View>
          </Shadow>
        </View>

        <View style={{ alignSelf: 'stretch', margin: 16 }}>
          <Text
            style={{ paddingBottom: 4, fontFamily: theme.fonts.medium.fontFamily, fontSize: 12 }}
          >
            Referrals
          </Text>
          <Shadow
            distance={2}
            startColor="rgba(0, 0, 0, 0.02)"
            radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
            viewStyle={{ alignSelf: 'stretch' }}
          >
            <View
              style={[
                {
                  marginVertical: 0,
                  backgroundColor: theme.colors.background,
                  borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
                },
              ]}
            >
              <PressableCard
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderTopLeftRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  borderTopRightRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  backgroundColor: theme.colors.onSurfaceLight,
                  borderBottomLeftRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                  borderBottomRightRadius: settings.sharpEdges
                    ? theme.tileModeRadius
                    : theme.roundModeRadius,
                }}
                onPress={() => {
                  navigation.navigate({
                    name: 'Settings Component',
                    params: {
                      launcherId: farm.launcherId,
                      token: farm.token,
                      defaultData: data.referrer,
                      type: 'referrer',
                      title: 'Referrer',
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ paddingLeft: 16 }}>{t('referrer')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        textAlign: 'right',
                        flex: 1,
                        paddingLeft: 16,
                        paddingRight: 16,
                        color: theme.colors.textGrey,
                        fontFamily: theme.fonts.medium.fontFamily,
                      }}
                    >
                      {data.referrer || 'None'}
                    </Text>
                    <Ionicons
                      style={{ paddingRight: 16 }}
                      name="chevron-forward-outline"
                      size={24}
                      color={theme.colors.text}
                    />
                  </View>
                </View>
              </PressableCard>
            </View>
          </Shadow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: theme.colors.onSurfaceLight,
      }}
    >
      <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 16 }}>{error.message}</Text>
      <Button mode="contained" onPress={resetErrorBoundary}>
        Retry
      </Button>
    </SafeAreaView>
  );
};

const FarmerSettingsScreen = (props) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Content {...props} />
    </ErrorBoundary>
  );
};

export default FarmerSettingsScreen;
