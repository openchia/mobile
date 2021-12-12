import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { useRecoilValue } from 'recoil';
import { settingsState } from '../Atoms';
import CustomCard from '../components/CustomCard';

const Item = ({ title, value, color }) => (
  <CustomCard style={styles.item}>
    <View>
      <Text
        numberOfLines={2}
        style={{
          color: '#4DB33E',
          fontSize: 14,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>
      <Text
        numberOfLines={3}
        style={{
          color: 'grey',
          textAlign: 'center',
          paddingTop: 4,
          paddingBottom: 4,
          fontSize: 12,
        }}
      >
        {value}
      </Text>
    </View>
  </CustomCard>
);

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
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <IconButton
      icon={icon}
      style={{ marginRight: 2 }}
      color="#fff"
      size={24}
      onPress={handlePress}
    />
  );
};

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useRecoilValue(settingsState);
  const fill = settings.isThemeDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: settings.isThemeDark ? theme.colors.primary : theme.colors.primaryLight,
      },
      headerRight: (props) => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginEnd: 8,
            alignItems: 'center',
          }}
        >
          <URLImageButton
            icon="youtube"
            url="https://www.youtube.com/channel/UCL70j_KiPd49rfp_UEqxiyQ"
          />
          <URLImageButton icon="github" url="https://github.com/openchia" />
          <URLImageButton icon="twitter" url="https://twitter.com/openchia" />
        </View>
      ),
    });
  }, [navigation, settings.isThemeDark]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: settings.isThemeDark ? theme.colors.primary : theme.colors.primaryLight,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 1080 1920"
          style={{ position: 'absolute' }}
        >
          <G fill="none">
            <Rect
              width="1080"
              height="1920"
              x="0"
              y="0"
              fill={settings.isThemeDark ? theme.colors.primary : theme.colors.primaryLight}
            />
            <Path
              d="M658.97,989.433C736.342,991.425,806.989,949.728,848.421,884.353C893.26,813.602,916.749,722.844,873.314,651.222C830.977,581.411,740.476,567.181,658.97,571.96C586.768,576.194,520.048,611.253,484.149,674.041C448.509,736.375,450.887,812.212,485.697,875.013C521.662,939.896,584.811,987.523,658.97,989.433"
              fill={fill}
              className="triangle-float2"
            />
            <Path
              d="M870.319,1714.631C899.11,1716.029,929.646,1709.485,945.534,1685.434C962.909,1659.133,965.388,1623.441,947.87,1597.235C931.733,1573.095,899.356,1572.958,870.319,1572.918C841.178,1572.878,807.401,1572.04,792.395,1597.02C777.137,1622.418,790.408,1653.997,806.773,1678.697C821.178,1700.439,844.269,1713.366,870.319,1714.631"
              fill={fill}
              className="triangle-float1"
            />
            <Path
              d="M1064.908,713.991C1132.649,714.352,1182.416,656.931,1214.22,597.119C1243.789,541.511,1248.715,477.373,1220.724,420.954C1189.027,357.066,1136.227,296.211,1064.908,296.17C993.542,296.129,940.163,356.678,908.78,420.773C881.281,476.935,888.934,540.348,918.324,595.544C949.968,654.973,997.58,713.633,1064.908,713.991"
              fill={fill}
              className="triangle-float1"
            />
            <Path
              d="M60.095,331.599C94.216,329.626,123.909,310.921,141.763,281.777C160.565,251.086,168.848,213.37,152.014,181.557C134.19,147.874,98.201,127.857,60.095,127.444C21.254,127.023,-15.215,146.304,-35.341,179.527C-56.228,214.006,-61.185,258.131,-39.757,292.276C-19.377,324.751,21.819,333.813,60.095,331.599"
              fill={fill}
              className="triangle-float1"
            />
            <Path
              d="M337.398,1388.416C378.182,1390.341,426.081,1389.829,446.527,1354.488C466.988,1319.12,444.754,1276.535,421.602,1242.867C402.073,1214.469,371.781,1198.162,337.398,1195.793C297.384,1193.036,251.529,1195.615,230.37,1229.689C208.475,1264.947,221.563,1310.552,244.766,1344.963C265.202,1375.271,300.885,1386.692,337.398,1388.416"
              fill={fill}
              className="triangle-float1"
            />
            <Path
              d="M496.616,397.691C561.921,394.916,616.152,354.709,650.888,299.339C688.442,239.477,714.896,165.825,680.962,103.839C646.042,40.052,569.334,16.972,496.616,17.54C425.041,18.099,354.204,45.415,317.193,106.68C278.987,169.924,279.05,250.6,317.828,313.494C354.882,373.592,426.077,400.689,496.616,397.691"
              fill={fill}
              className="triangle-float1"
            />
          </G>
        </Svg>
        <View
          style={{
            flex: 1,
            margin: 8,
          }}
        >
          <View
            style={{
              flex: 3.5,
              marginEnd: 4,
              marginStart: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              style={{
                // marginTop: 16,
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#fff',
              }}
            >
              {t('welcome')}
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#fff' }}>{t('trust')}</Text>
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#fff' }}>{t('open')}</Text>
            <URLButton
              url="https://openchia.io/en/join"
              backgroundColor="#FB6340"
              textColor="#fff"
              style={{ marginTop: 24 }}
            >
              {t('join')}
            </URLButton>
            <URLButton
              url="https://discord.com/invite/2URS9H7RZn"
              backgroundColor="#fff"
              textColor={theme.colors.primary}
              icon="discord"
              style={{ marginTop: 16 }}
            >
              {t('chat')}
            </URLButton>
          </View>
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
              alignItems: 'center',
              // marginTop: 12,
              // padding: 16,
              marginBottom: 16,
              marginEnd: 14,
              marginStart: 14,
            }}
          >
            <View style={styles.container}>
              <Item title={t('fee')} value={t('feeDesc')} />
              <View style={{ width: 8 }} />
              <Item title={t('minPayout')} value={t('minPayoutDesc')} />
            </View>
            <View style={styles.container}>
              <Item title={t('instantPayout')} value={t('instantPayoutDesc')} />
              <View style={{ width: 8 }} />
              <Item title={t('transparent')} value={t('transparentDesc')} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    flex: 1,
  },
  item: {
    padding: 14,
    backgroundColor: '#ededed',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export default HomeScreen;
