import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import DropShadow from 'react-native-drop-shadow';

const DashboardScreen = () => {
  const x = 0;
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f8f8f8' }}>
      <Shadow
        distance={0.01}
        // startColor="rgba(0, 0, 0, 0.01)"
        finalColor="rgba(0, 0, 0, 0.01)"
        offset={[0, 0]}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 2,
            borderColor: 'rgba(0, 0, 0, 0.05)',
            width: 250,
            height: 250,
          }}
        >
          <Text style={{ margin: 20, fontSize: 20 }}>🙂</Text>
        </View>
      </Shadow>
      <View style={{ height: 20 }} />
      <DropShadow
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 5,
        }}
      >
        <Text style={{ margin: 20, fontSize: 20 }}>🙂</Text>
      </DropShadow>
      <View style={{ height: 20 }} />

      <Shadow>
        <Text style={{ margin: 20, fontSize: 20 }}>🙂</Text>
      </Shadow>
      <View style={{ height: 20 }} />

      <Shadow>
        <Text style={{ margin: 20, fontSize: 20 }}>🙂</Text>
      </Shadow>
    </View>
  );
};

export default DashboardScreen;
