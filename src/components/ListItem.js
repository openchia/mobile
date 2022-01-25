import { useNetInfo } from '@react-native-community/netinfo';
import { format, fromUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getBlocks } from '../Api';
import { blocksRequestIDState } from '../Atoms';
import PressableCard from './PressableCard';

const ListItem = ({ header, subtitle1, subtitle2, headerItem, subtitleItem1, subtitleItem2 }) => {
  const theme = useTheme();
  return (
    <PressableCard style={{ marginBottom: 2, paddingTop: 6, paddingBottom: 6 }} onTap={() => {}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 }}>
        {headerItem ? (
          { headerItem }
        ) : (
          <Text numberOfLines={1} style={[{ color: theme.colors.textLight }, styles.title]}>
            {header}
          </Text>
        )}
        <View>
          {subtitleItem1 ? (
            { subtitleItem1 }
          ) : (
            <Text numberOfLines={1} style={[{ color: theme.colors.textGrey }, styles.subltitle]}>
              {subtitle1}
            </Text>
          )}
          {subtitleItem2 ? (
            { subtitleItem2 }
          ) : (
            <Text numberOfLines={1} style={[{ color: theme.colors.textGrey }, styles.subltitle]}>
              {subtitle2}
            </Text>
          )}
        </View>
      </View>
    </PressableCard>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    flex: 1,
  },
  subltitle: {
    textAlign: 'right',
    fontSize: 12,
  },
});

export default ListItem;
