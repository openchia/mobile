import React, { useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import PressableCard from '../../components/PressableCard';

const Item = ({ item, onPress }) => (
  <DropShadow
    style={{
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.05,
      // shadowOpacity: 1,
      shadowRadius: 3,
      flex: 1,
      //   marginVertical: 8,
    }}
  >
    <PressableCard
      style={{
        // marginBottom: 1,
        // paddingBottom: 12,
        marginHorizontal: 6,
        marginVertical: 4,
        borderRadius: 24,
      }}
      onPress={onPress}
    >
      <View
        style={{
          // padding: 14,
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          padding: 16,
        }}
      >
        <Text style={styles.label}>{item.name}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.label}>67.89 TiB</Text>
      </View>
    </PressableCard>
  </DropShadow>
);

const data = [
  //   {
  //     launcherId: 'cd0933d5ff19488c964e610cc56d9f8da6131ac148ea327233ccf36b8e5a317e',
  //     name: '🍻Solidatech01🍾',
  //   },
  //   {
  //     launcherId: 'cd0933d5ff19488c964e610cc56d9f8da6131ac148ea327233ccf36b8e5a317s',
  //     name: '🍻Solidatech02🍾',
  //   },
  //   {
  //     launcherId: 'cd0933d5ff19488c964e610cc56d9f8da6131ac148ea327233ccf36b8e5a317a',
  //     name: '🍻Solidatech03🍾',
  //   },
  //   {
  //     launcherId: 'cd0933d5ff19488c964e610cc56d9f8da6131ac148ea327233ccf36b8e5a317d',
  //     name: '🍻Solidatech04🍾',
  //   },
];

const FarmsScreen = ({ navigation }) => {
  const theme = useTheme();

  const renderItem = useCallback(({ item }) => <Item item={item} onPress={() => {}} />, []);

  if (data.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.divider,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>Add Farm To Dashboard</Text>
        <Text style={{ fontSize: 14, color: theme.colors.textGrey, paddingBottom: 16 }}>
          Shows all data relevent to your Farm.
        </Text>
        <IconButton
          style={{ backgroundColor: theme.colors.primary }}
          icon="plus"
          size={32}
          color={theme.colors.surface}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.divider }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={<View style={{ marginTop: 6 }} />}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.launcherId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  itemNotSelected: {
    // backgroundColor: '#dbdbdb',
    // padding: 14,
    // paddingEnd: 20,
    // marginVertical: 8,
    // borderRadius: 8,
    // marginHorizontal: 16,
    // borderColor: '#c9c9c9', // if you need
    // borderWidth: 1,
    // overflow: 'hidden',
    // shadowColor: '#000',
    // shadowRadius: 10,
    // shadowOpacity: 1,
    // elevation: 6,
    display: 'flex',
    flexDirection: 'row',
  },
});

export default FarmsScreen;
