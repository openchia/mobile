/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import CustomCard from '../../components/CustomCard';

const TIERS = [
  { tickets: 1, size: 100 },
  { tickets: 2, size: 100 },
  { tickets: 5, size: 300 },
  { tickets: 10, size: 500 },
  { tickets: 20 },
];

const calculateTicketCount = (val) => {
  let rest = val;
  let newVal = 0;
  TIERS.every((tier) => {
    if (tier.tickets === 20) {
      newVal += Math.floor(rest / tier.tickets);
      return true;
    }
    if (rest > tier.size) {
      newVal += tier.size / tier.tickets;
      rest -= tier.size;
      return true;
    }
    newVal += Math.floor(rest / tier.tickets);
    return false;
  });
  return newVal;
};

const TierItem = ({ tier, tickets, color }) => (
  <View
    style={{
      // justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    }}
  >
    <Text numberOfLines={1} style={[styles.title]}>
      {tier}
    </Text>
    <Text numberOfLines={1} style={styles.val}>
      {tickets}
    </Text>
  </View>
);

const CalculatorScreen = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [number, onChangeNumber] = useState();
  const [ticketCount, setTicketCount] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, margin: 8 }}>
      <Text
        style={[
          styles.desc,
          {
            textAlign: 'center',
            padding: 8,
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.drawerSelected,
          },
        ]}
      >
        {t('giveawayEveryday')}
      </Text>
      <CustomCard
        style={{ marginTop: 16, backgroundColor: theme.colors.onSurfaceLight, borderRadius: 24 }}
      >
        <View style={{ padding: 12 }}>
          <View
            style={{
              // justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              paddingBottom: 8,
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.title, { color: theme.colors.drawerSelected, fontWeight: 'bold' }]}
            >
              Tier
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.val, { color: theme.colors.drawerSelected, fontWeight: 'bold' }]}
            >
              Ticket Each
            </Text>
          </View>
          <TierItem tier="0-100 TiB" tickets="1 TiB" />
          <TierItem tier="100-200 TiB" tickets="2 TiB" />
          <TierItem tier="200-500 TiB" tickets="5 TiB" />
          <TierItem tier="500-1000 TiB" tickets="10 TiB" />
          <TierItem tier="1000+ TiB" tickets="20 TiB" />
        </View>
      </CustomCard>
      <CustomCard
        style={{ marginTop: 16, backgroundColor: theme.colors.onSurfaceLight, borderRadius: 24 }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', flex: 1, padding: 12 }}>
            <Text style={{ color: theme.colors.drawerSelected, fontWeight: 'bold' }}>
              Farm Size
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{ backgroundColor: 'transparent', flex: 1, marginEnd: 16 }}
                mode="flat"
                onChangeText={onChangeNumber}
                value={number}
                // placeholder="TiB"
                keyboardType="numeric"
              />
              <Text>TiB</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'column', padding: 12, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.drawerSelected, fontWeight: 'bold' }}>
              Tickets/Day
            </Text>
            <Text
              style={{ textAlignVertical: 'center', flex: 1, fontSize: 16, fontWeight: 'bold' }}
            >
              {ticketCount}
            </Text>
          </View>
        </View>
        <Button
          style={{ margin: 10, borderRadius: 24 }}
          mode="contained"
          onPress={() => {
            if (!isNaN(number)) {
              setTicketCount(calculateTicketCount(number));
            }
          }}
        >
          Calculate
        </Button>
      </CustomCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    // marginEnd: 8,
  },
  val: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
});

export default CalculatorScreen;
