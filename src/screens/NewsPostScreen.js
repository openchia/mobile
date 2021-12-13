import { format } from 'date-fns';
import React from 'react';
import { Image, ScrollView, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';

const NewsPostScreen = ({ navigation, route }) => {
  const { post } = route.params;
  const { width } = useWindowDimensions();

  const theme = useTheme();
  const tagsStyles = {
    body: {
      color: theme.colors.text,
    },
    a: {
      color: theme.colors.primaryLight,
    },
    span: {
      fontSize: 12,
    },
  };
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
          tagsStyles={tagsStyles}
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
