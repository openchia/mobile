import React, { useLayoutEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { groupsState } from '../../Atoms';
import IconButton from '../../components/IconButton';
import PressableCard from '../../components/PressableCard';

const Item = ({ item, onPress }) => (
  <PressableCard style={{ marginVertical: 2, marginHorizontal: 8 }} onPress={onPress}>
    <View
      style={{
        padding: 14,
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Text style={styles.label}>{item.title}</Text>
      {/* <View style={{ flex: 1 }} />
      <Text style={styles.label}>{item[item.key.toUpperCase()]}</Text> */}
    </View>
  </PressableCard>
);

const GroupScreen = ({ navigation, route }) => {
  const [groups, setGroups] = useRecoilState(groupsState);

  const renderItem = ({ item }) => (
    <Item
      item={item}
      onPress={() => {
        console.log('pressed');
      }}
    />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <IconButton
            icon={
              <Ionicons
                name="ios-add"
                size={24}
                color="white"
                onPress={() => {
                  navigation.navigate('Create Group');
                }}
              />
            }
          />
        </View>
      ),
    });
  }, [navigation, route, groups]);
  return (
    // <LoadingComponent />
    <SafeAreaView>
      <FlatList
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', fontSize: 30, padding: 10 }}>
            No groups created yet.
          </Text>
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
    display: 'flex',
    flexDirection: 'row',
  },
});

export default GroupScreen;
