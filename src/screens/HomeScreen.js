import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, View, Linking, Alert } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Svg, { Path, Rect, G } from 'react-native-svg';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace } from '../Api';
import LoadingComponent from '../components/LoadingComponent';

// const test = (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     version="1.1"
//     xmlns:xlink="http://www.w3.org/1999/xlink"
//     xmlns:svgjs="http://svgjs.com/svgjs"
//     width="1080"
//     height="1920"
//     preserveAspectRatio="none"
//     viewBox="0 0 1080 1920"
//   >
//     <g mask='url("#SvgjsMask1567")' fill="none">
//       <rect width="1080" height="1920" x="0" y="0" fill="rgba(0, 134, 64, 1)" />
//       <Path
//         d="M658.97,989.433C736.342,991.425,806.989,949.728,848.421,884.353C893.26,813.602,916.749,722.844,873.314,651.222C830.977,581.411,740.476,567.181,658.97,571.96C586.768,576.194,520.048,611.253,484.149,674.041C448.509,736.375,450.887,812.212,485.697,875.013C521.662,939.896,584.811,987.523,658.97,989.433"
//         fill="rgba(0, 120, 57, 0.82)"
//         className="triangle-float2"
//       />
//       <Path
//         d="M870.319,1714.631C899.11,1716.029,929.646,1709.485,945.534,1685.434C962.909,1659.133,965.388,1623.441,947.87,1597.235C931.733,1573.095,899.356,1572.958,870.319,1572.918C841.178,1572.878,807.401,1572.04,792.395,1597.02C777.137,1622.418,790.408,1653.997,806.773,1678.697C821.178,1700.439,844.269,1713.366,870.319,1714.631"
//         fill="rgba(0, 120, 57, 0.82)"
//         className="triangle-float1"
//       />
//       <Path
//         d="M1064.908,713.991C1132.649,714.352,1182.416,656.931,1214.22,597.119C1243.789,541.511,1248.715,477.373,1220.724,420.954C1189.027,357.066,1136.227,296.211,1064.908,296.17C993.542,296.129,940.163,356.678,908.78,420.773C881.281,476.935,888.934,540.348,918.324,595.544C949.968,654.973,997.58,713.633,1064.908,713.991"
//         fill="rgba(0, 120, 57, 0.82)"
//         className="triangle-float1"
//       />
//       <Path
//         d="M60.095,331.599C94.216,329.626,123.909,310.921,141.763,281.777C160.565,251.086,168.848,213.37,152.014,181.557C134.19,147.874,98.201,127.857,60.095,127.444C21.254,127.023,-15.215,146.304,-35.341,179.527C-56.228,214.006,-61.185,258.131,-39.757,292.276C-19.377,324.751,21.819,333.813,60.095,331.599"
//         fill="rgba(0, 120, 57, 0.82)"
//         className="triangle-float1"
//       />
//       <Path
//         d="M337.398,1388.416C378.182,1390.341,426.081,1389.829,446.527,1354.488C466.988,1319.12,444.754,1276.535,421.602,1242.867C402.073,1214.469,371.781,1198.162,337.398,1195.793C297.384,1193.036,251.529,1195.615,230.37,1229.689C208.475,1264.947,221.563,1310.552,244.766,1344.963C265.202,1375.271,300.885,1386.692,337.398,1388.416"
//         fill="rgba(0, 120, 57, 0.82)"
//         className="triangle-float1"
//       />
//       <Path
//         d="M496.616,397.691C561.921,394.916,616.152,354.709,650.888,299.339C688.442,239.477,714.896,165.825,680.962,103.839C646.042,40.052,569.334,16.972,496.616,17.54C425.041,18.099,354.204,45.415,317.193,106.68C278.987,169.924,279.05,250.6,317.828,313.494C354.882,373.592,426.077,400.689,496.616,397.691"
//         fill="rgba(0, 120, 57, 0.82)"
//         className="triangle-float1"
//       />
//     </g>
//     <defs>
//       <mask id="SvgjsMask1567">
//         <rect width="1080" height="1920" fill="#ffffff" />
//       </mask>
//     </defs>
//   </svg>
// );

const URLButton = ({ url, children, backgroundColor, textColor, icon, style }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <Button
      color={backgroundColor}
      // color="#FB6340"
      mode="contained"
      labelStyle={{ color: textColor }}
      onPress={handlePress}
      style={style}
      icon={icon}
    >
      {children}
    </Button>
  );
};

const URLImageButton = ({ url, icon }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <IconButton
      icon={icon}
      style={{ marginLeft: 24 }}
      color="#fff"
      size={32}
      onPress={handlePress}
    />
  );
};

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

  // const handlePress = useCallback(async () => {
  //   // Checking if the link is supported for links with custom URL scheme.
  //   const supported = await Linking.canOpenURL('https://openchia.io/en/join');

  //   if (supported) {
  //     // Opening the link with some app, if the URL scheme is "http" the web link should be opened
  //     // by some browser in the mobile
  //     await Linking.openURL('https://openchia.io/en/join');
  //   } else {
  //     Alert.alert(`Don't know how to open this URL: ${'https://openchia.io/en/join'}`);
  //   }
  // }, [url]);

  return (
    <SafeAreaView style={{ display: 'flex', flex: 1 }}>
      <Svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute' }}
      >
        <G mask='url("#SvgjsMask1559")' fill="none">
          <Rect width="1080" height="1920" x="0" y="0" fill="#119400" />
          <Path
            d="M658.97,989.433C736.342,991.425,806.989,949.728,848.421,884.353C893.26,813.602,916.749,722.844,873.314,651.222C830.977,581.411,740.476,567.181,658.97,571.96C586.768,576.194,520.048,611.253,484.149,674.041C448.509,736.375,450.887,812.212,485.697,875.013C521.662,939.896,584.811,987.523,658.97,989.433"
            fill="rgba(115, 195, 104, 0.4)"
            className="triangle-float2"
          />
          <Path
            d="M870.319,1714.631C899.11,1716.029,929.646,1709.485,945.534,1685.434C962.909,1659.133,965.388,1623.441,947.87,1597.235C931.733,1573.095,899.356,1572.958,870.319,1572.918C841.178,1572.878,807.401,1572.04,792.395,1597.02C777.137,1622.418,790.408,1653.997,806.773,1678.697C821.178,1700.439,844.269,1713.366,870.319,1714.631"
            fill="rgba(115, 195, 104, 0.4)"
            className="triangle-float1"
          />
          <Path
            d="M1064.908,713.991C1132.649,714.352,1182.416,656.931,1214.22,597.119C1243.789,541.511,1248.715,477.373,1220.724,420.954C1189.027,357.066,1136.227,296.211,1064.908,296.17C993.542,296.129,940.163,356.678,908.78,420.773C881.281,476.935,888.934,540.348,918.324,595.544C949.968,654.973,997.58,713.633,1064.908,713.991"
            fill="rgba(115, 195, 104, 0.4)"
            className="triangle-float1"
          />
          <Path
            d="M60.095,331.599C94.216,329.626,123.909,310.921,141.763,281.777C160.565,251.086,168.848,213.37,152.014,181.557C134.19,147.874,98.201,127.857,60.095,127.444C21.254,127.023,-15.215,146.304,-35.341,179.527C-56.228,214.006,-61.185,258.131,-39.757,292.276C-19.377,324.751,21.819,333.813,60.095,331.599"
            fill="rgba(115, 195, 104, 0.4)"
            className="triangle-float1"
          />
          <Path
            d="M337.398,1388.416C378.182,1390.341,426.081,1389.829,446.527,1354.488C466.988,1319.12,444.754,1276.535,421.602,1242.867C402.073,1214.469,371.781,1198.162,337.398,1195.793C297.384,1193.036,251.529,1195.615,230.37,1229.689C208.475,1264.947,221.563,1310.552,244.766,1344.963C265.202,1375.271,300.885,1386.692,337.398,1388.416"
            fill="rgba(115, 195, 104, 0.4)"
            className="triangle-float1"
          />
          <Path
            d="M496.616,397.691C561.921,394.916,616.152,354.709,650.888,299.339C688.442,239.477,714.896,165.825,680.962,103.839C646.042,40.052,569.334,16.972,496.616,17.54C425.041,18.099,354.204,45.415,317.193,106.68C278.987,169.924,279.05,250.6,317.828,313.494C354.882,373.592,426.077,400.689,496.616,397.691"
            fill="rgba(115, 195, 104, 0.4)"
            className="triangle-float1"
          />
        </G>
      </Svg>
      {/* <Svg
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
      </Svg> */}
      <IconButton
        style={{ marginLeft: 4, marginTop: 4 }}
        icon="menu"
        color="#fff"
        size={32}
        onPress={() => navigation.openDrawer()}
      />
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          // marginTop: 24,
        }}
      >
        <Text style={{ marginTop: 60, fontSize: 30, textAlign: 'center', color: '#fff' }}>
          {t('common:welcome')}
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', color: '#fff', marginTop: 16 }}>
          {t('common:trust')}
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', color: '#fff' }}>{t('common:open')}</Text>
        <URLButton
          url="https://openchia.io/en/join"
          backgroundColor="#FB6340"
          textColor="#fff"
          style={{ marginTop: 40 }}
        >
          {t('common:join')}
        </URLButton>
        <URLButton
          url="https://discord.com/invite/2URS9H7RZn"
          backgroundColor="#fff"
          textColor={theme.colors.primary}
          icon="discord"
          style={{ marginTop: 16 }}
        >
          {t('common:chat')}
        </URLButton>
        {/* <Button
          icon="discord"
          color="#fff"
          mode="contained"
          labelStyle={{ color: theme.colors.primary }}
          style={{ marginTop: 20 }}
        >
          {t('common:chat')}
        </Button> */}
        <View style={{ flex: 1 }} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 24,
          }}
        >
          <URLImageButton
            icon="youtube"
            url="https://www.youtube.com/channel/UCL70j_KiPd49rfp_UEqxiyQ"
          />
          {/* <URLImageButton icon="discord" url="https://discord.com/invite/2URS9H7RZn" /> */}
          <URLImageButton icon="github" url="https://github.com/openchia" />
          <URLImageButton icon="twitter" url="https://twitter.com/openchia" />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;
