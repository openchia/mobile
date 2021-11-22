import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView, View, TextInput } from 'react-native';
// import { TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import IconButton from '../../components/IconButton';
import { updateFarmerName } from '../../Api';
import { launcherIDsState } from '../../Atoms';
import { getObject } from '../../utils/Utils';

const FarmerNameScreen = ({ route, navigation }) => {
  const [farmerName, setFarmerName] = useState(null);
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);

  const { launcherId, token } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginEnd: -12,
            alignItems: 'center',
          }}
        >
          <IconButton
            icon={<Ionicons name="ios-save-outline" size={24} color="white" />}
            style={{ marginEnd: 20 }}
            color="#fff"
            size={24}
            onPress={() => {
              console.log(launcherIDs);
              updateFarmerName(launcherId, token, farmerName)
                .then(() => {
                  setLauncherIDs(
                    (prev) =>
                      new Map(
                        prev.set(launcherId, {
                          name: farmerName,
                          token,
                        })
                      )
                  );
                })
                .finally(() => {
                  navigation.goBack();
                });
            }}
          />
        </View>
      ),
    });
  }, [navigation, farmerName]);

  return (
    <SafeAreaView>
      <TextInput
        //   style={styles.input}
        onChangeText={(text) => {
          setFarmerName(text);
        }}
        value={farmerName}
        placeholder="Display Name"
        keyboardType="default"
      />
    </SafeAreaView>
  );
};
export default FarmerNameScreen;
