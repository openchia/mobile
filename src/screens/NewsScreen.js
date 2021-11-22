import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
// import { FlatList } from 'react-native-gesture-handler';
import { Text, useTheme } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getChiaPlotPosts } from '../Api';
import { newsRefreshState } from '../Atoms';
import LoadingComponent from '../components/LoadingComponent';

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
      const response = await getChiaPlotPosts();
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item, width, onPress }) => {
  const theme = useTheme();
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

  // const customHTMLElementModels = {
  //   'blue-circle': HTMLElementModel.fromCustomModel({
  //     tagName: 'blue-circle',
  //     mixedUAStyles: {
  //       width: 50,
  //       height: 50,
  //       borderRadius: 25,
  //       alignSelf: 'center',
  //       backgroundColor: 'blue',
  //     },
  //     contentModel: HTMLContentModel.block,
  //   }),
  // };

  return (
    // <PressableCard onPress={onPress}>
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 12,
        paddingBottom: 12,
        paddingStart: 12,
        paddingEnd: 12,
      }}
    >
      <Image
        style={{ height: 200, width: '100%', borderRadius: 6 }}
        source={{
          uri: item.jetpack_featured_media_url,
        }}
      />
      <View style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: 12 }}>
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
    // {/* </PressableCard> */}
  );
};

const NewsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const refresh = useRefresh();
  const postsLoadable = useRecoilValueLoadable(query());
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (postsLoadable.state === 'hasValue') {
      setData(postsLoadable.contents);
      setRefreshing(false);
    }
  }, [postsLoadable.contents]);

  const renderItem = ({ item, index }) => (
    <Item
      item={item}
      rank={index}
      width={width}
      onPress={() => {
        navigation.navigate('Post', { post: item });
      }}
    />
  );

  if (postsLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
