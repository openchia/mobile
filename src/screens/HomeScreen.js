import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, View } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Svg, { Path, Rect, G } from 'react-native-svg';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace } from '../Api';
import LoadingComponent from '../components/LoadingComponent';

const test = (
  <Svg width="400" height="1000" preserveAspectRatio="none" viewBox="0 0 400 1000">
    <G mask='url("#SvgjsMask1065")' fill="none">
      <Rect width="400" height="1000" x="0" y="0" fill="#0e2a47" />
      <Path
        d="M0,353.585C65.854,345.058,118.886,303.679,182.106,283.363C273.679,253.936,412.248,293.972,454.46,207.545C496.2,122.084,358.227,44.583,344.71,-49.562C331.188,-143.737,437.17,-253.013,377.673,-327.255C319.031,-400.429,196.345,-341.29,103.083,-351.068C30.005,-358.73,-39.298,-393.935,-111.139,-378.505C-185.874,-362.453,-260.745,-326.477,-304.2,-263.591C-346.297,-202.671,-318.095,-119.777,-339.01,-48.742C-364.977,39.454,-469.373,113.963,-441.122,201.454C-413.693,286.4,-299.551,305.697,-215.163,334.8C-145.696,358.757,-72.874,363.02,0,353.585"
        fill="#091b2e"
      />
      <Path
        d="M400 1390.248C475.341 1398.232 552.434 1377.325 616.004 1336.108 679.437 1294.98 723.3 1230.7350000000001 753.149 1161.278 782.531 1092.907 796.524 1018.15 784.185 944.763 772.0160000000001 872.385 740.3620000000001 801.105 684.575 753.414 631.924 708.404 556.165 713.9780000000001 490.051 693.313 422.438 672.179 357.794 605.5350000000001 291.522 630.559 224.392 655.9069999999999 229.724 757.5699999999999 180.817 810.077 128.99200000000002 865.717 19.365999999999985 868.861 0.8659999999999854 942.613-17.192000000000007 1014.604 60.432000000000016 1073.998 98.65800000000002 1137.618 132.346 1193.686 161.418 1251.222 211.543 1293.245 266.805 1339.574 328.289 1382.6480000000001 400 1390.248"
        fill="#133960"
      />
    </G>
    {/* <defs>
      <mask id="SvgjsMask1065">
        <rect width="400" height="1000" fill="#ffffff" />
      </mask>
    </defs> */}
  </Svg>
);

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      // headerStyle: { backgroundColor: theme.colors.primary },
    });
  }, [navigation]);

  const shapes = {
    pathOne:
      'M380.279 107.377C380.279 107.377 295.739 13.1031 187.625 107.25C79.5108 201.397 -1.97128 107.125 -1.97128 107.125L-1.89778 1.07516e-06L380.353 0.252415L380.279 107.377Z',
  };

  return (
    <SafeAreaView style={{ display: 'flex', flex: 1 }}>
      <Svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ position: 'absolute' }}
        viewBox="0 0 400 1000"
      >
        <G mask='url("#SvgjsMask1065")' fill="none">
          <Rect width="400" height="1000" x="0" y="0" fill="#00ad53" />
          <Path
            d="M0,353.585C65.854,345.058,118.886,303.679,182.106,283.363C273.679,253.936,412.248,293.972,454.46,207.545C496.2,122.084,358.227,44.583,344.71,-49.562C331.188,-143.737,437.17,-253.013,377.673,-327.255C319.031,-400.429,196.345,-341.29,103.083,-351.068C30.005,-358.73,-39.298,-393.935,-111.139,-378.505C-185.874,-362.453,-260.745,-326.477,-304.2,-263.591C-346.297,-202.671,-318.095,-119.777,-339.01,-48.742C-364.977,39.454,-469.373,113.963,-441.122,201.454C-413.693,286.4,-299.551,305.697,-215.163,334.8C-145.696,358.757,-72.874,363.02,0,353.585"
            fill={theme.colors.primary}
          />
          <Path
            d="M400 1390.248C475.341 1398.232 552.434 1377.325 616.004 1336.108 679.437 1294.98 723.3 1230.7350000000001 753.149 1161.278 782.531 1092.907 796.524 1018.15 784.185 944.763 772.0160000000001 872.385 740.3620000000001 801.105 684.575 753.414 631.924 708.404 556.165 713.9780000000001 490.051 693.313 422.438 672.179 357.794 605.5350000000001 291.522 630.559 224.392 655.9069999999999 229.724 757.5699999999999 180.817 810.077 128.99200000000002 865.717 19.365999999999985 868.861 0.8659999999999854 942.613-17.192000000000007 1014.604 60.432000000000016 1073.998 98.65800000000002 1137.618 132.346 1193.686 161.418 1251.222 211.543 1293.245 266.805 1339.574 328.289 1382.6480000000001 400 1390.248"
            fill="#12c769"
          />
        </G>
      </Svg>
      <IconButton icon="menu" color="#fff" size={20} onPress={() => navigation.openDrawer()} />
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginTop: 24,
        }}
      >
        <Text style={{ fontSize: 30, textAlign: 'center', color: '#fff' }}>
          {t('common:welcome')}
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', color: '#fff', marginTop: 16 }}>
          {t('common:trust')}
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', color: '#fff' }}>{t('common:open')}</Text>
        <Button
          color="#FB6340"
          mode="contained"
          labelStyle={{ color: '#fff' }}
          style={{ marginTop: 40 }}
        >
          {t('common:join')}
        </Button>
        <Button
          icon="discord"
          color="#fff"
          mode="contained"
          labelStyle={{ color: theme.colors.primary }}
          style={{ marginTop: 40 }}
        >
          {t('common:chat')}
        </Button>
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;
