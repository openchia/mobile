import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import TestStackedBarChart from '../../charts/TestStackedBarChart';
import TestLabel from '../../components/TextTest';

export const { width } = Dimensions.get('window');
const keys = ['failed', 'passed'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PartialChart = ({ partials, stats, children }) => {
  const selectedPoints = useSharedValue(null);
  const theme = useTheme();
  const colors = [theme.colors.accent, theme.colors.primary];
  const { t } = useTranslation();

  const formatDatetime = (value) => {
    'worklet';

    // we have to do it manually due to limitations of reanimated
    if (value === '') {
      return '';
    }

    const start = new Date(Number(value.start) * 1000);
    const end = new Date(Number(value.end) * 1000);
    // const end = new Date((Number(value) + interval * 3600) * 1000);
    // const end = date.setHours(date.getHours() + interval);
    const now = new Date();

    let res = `${MONTHS[start.getMonth()]} `;

    const d = start.getDate();
    if (d < 10) {
      res += '0';
    }
    res += d;

    const y = start.getFullYear();
    const yCurrent = now.getFullYear();
    if (y !== yCurrent) {
      res += `, ${y}`;
      return res;
    }

    const h = start.getHours() % 12;
    if (h === 0) {
      res += ' 12:';
    } else if (h < 10) {
      res += ` 0${h}:`;
    } else {
      res += ` ${h}:`;
    }

    const m = start.getMinutes();
    if (m < 10) {
      res += '0';
    }
    res += `${m} `;

    if (start.getHours() < 12) {
      res += 'AM';
    } else {
      res += 'PM';
    }

    res += ' - ';

    res += `${MONTHS[end.getMonth()]} `;

    const d1 = end.getDate();
    if (d1 < 10) {
      res += '0';
    }
    res += d1;

    const y1 = end.getFullYear();
    const yCurrent1 = now.getFullYear();
    if (y1 !== yCurrent1) {
      res += `, ${y1}`;
      return res;
    }

    const h1 = end.getHours() % 12;
    if (h1 === 0) {
      res += ' 12:';
    } else if (h1 < 10) {
      res += ` 0${h1}:`;
    } else {
      res += ` ${h1}:`;
    }

    const m1 = end.getMinutes();
    if (m1 < 10) {
      res += '0';
    }
    res += `${m1} `;

    if (end.getHours() < 12) {
      res += 'AM';
    } else {
      res += 'PM';
    }

    return res;
  };

  return (
    <View style={{ alignContent: 'center', flex: 1 }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TestLabel
            interval={1}
            defaultValue={`${stats.label} ${t('overView')}`}
            format={formatDatetime}
            style={{ color: theme.colors.text, fontSize: 16, fontWeight: 'bold' }}
            selectedPoints={selectedPoints}
            type="time"
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginEnd: 16, color: theme.colors.textLight }}>
            {t('successfulPartials')}
          </Text>
          <TestLabel
            interval={1}
            defaultValue={`${stats.passed}`}
            style={{ color: theme.colors.text, fontSize: 16 }}
            selectedPoints={selectedPoints}
            type="passed"
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginEnd: 16, color: theme.colors.accent }}>{t('failedPartials')}</Text>
          <TestLabel
            interval={1}
            defaultValue={`${stats.failed}`}
            style={{ color: theme.colors.text, fontSize: 16 }}
            selectedPoints={selectedPoints}
            type="failed"
          />
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TestStackedBarChart
          data={partials}
          width={width}
          height={250}
          keys={keys}
          colors={colors}
          selectedPoints={selectedPoints}
        />
        {children}
      </View>
    </View>
  );
};

export default PartialChart;
