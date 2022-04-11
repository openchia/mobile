import { useNetInfo } from '@react-native-community/netinfo';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Button, Text, useTheme } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import { Shadow } from 'react-native-shadow-2';
import { selectorFamily, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import LoadingComponent from '../components/LoadingComponent';
import PressableCard from '../components/PressableCard';
import { newsRefreshState, settingsState } from '../recoil/Atoms';
import { api, CHIA_PLOT_REST_API } from '../services/Api';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(newsRefreshState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'postsSelector',
  get:
    () =>
    async ({ get }) => {
      get(newsRefreshState());
      const response = await api({ baseURL: CHIA_PLOT_REST_API, url: 'posts' });
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item, width, onPress, tagsStyles, theme, settings }) => (
  <View style={{ alignSelf: 'stretch', marginVertical: 10, marginHorizontal: 16 }}>
    <Shadow
      distance={2}
      startColor="rgba(0, 0, 0, 0.02)"
      // finalColor="rgba(0, 0, 0, 0.01)"
      // containerViewStyle={{ marginVertical: 16 }}
      radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
      viewStyle={{ alignSelf: 'stretch' }}
    >
      <PressableCard
        onPress={onPress}
        style={{
          borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
          backgroundColor: theme.colors.onSurfaceLight,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 12,
          }}
        >
          <FastImage
            style={{ width: '100%', height: 200 }}
            source={{
              uri: item.jetpack_featured_media_url,
              headers: { Authorization: 'someAuthToken' },
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              paddingTop: 12,
              paddingStart: 12,
              paddingEnd: 12,
            }}
          >
            <RenderHtml
              tagsStyles={tagsStyles}
              contentWidth={width}
              // customHTMLElementModels={customHTMLElementModels}
              source={{ html: `<h2><strong>${item.title.rendered}</strong></h2>` }}
            />
            <View style={{ flex: 1 }}>
              <RenderHtml
                enableCSSInlineProcessing
                tagsStyles={tagsStyles}
                contentWidth={width}
                source={{ html: item.excerpt.rendered }}
              />
            </View>
            <Text style={styles.date}>{format(new Date(item.modified), 'PP')}</Text>
          </View>
        </View>
      </PressableCard>
    </Shadow>
  </View>
);
const NewsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const refresh = useRefresh();
  const postsLoadable = useRecoilValueLoadable(query());
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const netInfo = useNetInfo();
  const settings = useRecoilValue(settingsState);

  const tagsStyles = {
    body: {
      color: theme.colors.text,
    },
    p: {
      fontSize: 12,
    },
    h2: {
      fontSize: 14,
    },
  };

  useEffect(() => {
    if (postsLoadable.state === 'hasValue') {
      setData(postsLoadable.contents);
      setRefreshing(false);
    }
  }, [postsLoadable.state]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <Item
        item={item}
        rank={index}
        theme={theme}
        width={width}
        tagsStyles={tagsStyles}
        settings={settings}
        onPress={() => {
          navigation.navigate('Post', { post: item });
        }}
      />
    ),
    [settings.isThemeDark, settings.sharpEdges]
  );

  if (postsLoadable.state === 'hasError') {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <FocusAwareStatusBar
          backgroundColor={theme.colors.statusBarColor}
          barStyle={settings.isThemeDark ? 'light-content' : 'dark-content'}
        />
        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
          Cant Connect to Network
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            if (netInfo.isConnected) refresh();
          }}
        >
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  if (postsLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusAwareStatusBar
        backgroundColor={theme.colors.statusBarColor}
        barStyle={settings.isThemeDark ? 'light-content' : 'dark-content'}
      />
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              refresh();
            }}
          />
        }
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    // marginEnd: 12,
  },
  content: {
    fontSize: 12,
    flex: 1,
    // marginEnd: 20,
    // color: '#407538',
    // flex: 1,
  },
  date: {
    textAlign: 'right',
    fontSize: 12,
  },
});

export default NewsScreen;
