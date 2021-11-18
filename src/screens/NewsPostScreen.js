import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  ScrollView,
  View,
  useWindowDimensions,
  Image,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

const tagsStyles = {
  p: {
    // color: 'green',
  },
  a: {
    color: 'green',
  },
  span: {
    fontSize: 12,
  },
};

const NewsPostScreen = ({ navigation, route }) => {
  const { post } = route.params;
  const { width } = useWindowDimensions();
  return (
    <ScrollView contentContainerStyle={{ margin: 8 }}>
      <Image
        style={{ height: 200, width: '100%', borderRadius: 6 }}
        source={{
          uri: post.jetpack_featured_media_url,
        }}
      />
      <View style={{ alignItems: 'center' }}>
        <RenderHtml
          contentWidth={width}
          source={{ html: `<h2><strong>${post.title.rendered}</strong></h2>` }}
        />
        <RenderHtml
          contentWidth={width}
          tagsStyles={tagsStyles}
          source={{
            html: `<span>Posted on<a href="https://thechiaplot.net/2021/11/17/thoughts-on-chia-dust-storm-qa/"> ${format(
              new Date(post.modified),
              'PP'
            )}</a><span> by</span><a href="https://thechiaplot.net/author/blaktron/"> Chris Dupres</a></span>`,
          }}
        />
      </View>
      <View style={{ marginStart: 8, marginEnd: 8 }}>
        <RenderHtml
          tagsStyles={tagsStyles}
          contentWidth={width}
          source={{ html: post.content.rendered }}
        />
      </View>
    </ScrollView>
  );
};

export default NewsPostScreen;
