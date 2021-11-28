import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconButton from '../../components/IconButton';

const FarmerNotificationScreen = ({ route, navigation }) => {
  const [name, onNameChange] = React.useState(null);

  const { launcherId } = route.params;

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
              //   updateFarmerName(launcherId, token, FCMToken).then(() => {
              //     navigation.navigate({
              //       name: 'Farmer Details',
              //       params: { launcherId: data.launcher_id, name: data.name },
              //     });
              //   });
            }}
          />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <TextInput
        //   style={styles.input}
        onChangeText={onNameChange}
        value={name}
        placeholder="Display Name"
        keyboardType="default"
      />
    </SafeAreaView>
  );
};
export default FarmerNotificationScreen;
