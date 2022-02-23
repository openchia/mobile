import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Divider, IconButton, Menu, Text, useTheme } from 'react-native-paper';

const DropdownSelector = ({
  data,
  onPressed,
  valueExtractor,
  keyExtractor,
  style,
  defaultTitle,
  setSelected,
  selected,
}) => {
  // const [selected, setSelected] = useState(null || defaultTitle);
  const [open, setOpen] = useState(false);
  const [measurements, setMeasurements] = useState();
  const theme = useTheme();
  const [closing, setClosing] = useState(undefined);

  useEffect(() => {
    if (closing) {
      setClosing(null);
    }
  }, [closing]);

  if (!data) return null;

  return (
    <Pressable
      onLayout={({ nativeEvent }) => {
        setMeasurements(nativeEvent.layout);
      }}
      onPress={() => {
        setOpen(true);
      }}
      style={() => [
        {
          borderColor: open ? theme.colors.primary : theme.colors.textGrey,
          borderRadius: 24,
          borderWidth: 0.6,
          marginTop: 10,
          padding: 4,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        },
        style,
      ]}
    >
      <Text
        numberOfLines={1}
        style={{
          paddingTop: 2,
          fontSize: 13,
          paddingLeft: 16,
          textAlign: 'center',
        }}
      >
        {selected ? valueExtractor(selected) : defaultTitle}
      </Text>
      <IconButton
        style={{ marginRight: 10, margin: 0 }}
        icon={open ? 'chevron-up' : 'chevron-down'}
        size={16}
      />
      {measurements && !closing && (
        <Menu
          visible={open}
          onDismiss={() => setOpen(false)}
          anchor={{ x: measurements.x, y: measurements.y + measurements.height }}
          contentStyle={{ borderRadius: 8 }}
        >
          {selected && (
            <Menu.Item
              key={defaultTitle}
              onPress={() => {
                setClosing(defaultTitle);
                setSelected(defaultTitle);
                setOpen(false);
                onPressed();
              }}
              title={defaultTitle}
            />
          )}
          {data
            .filter((item) => keyExtractor(item) !== (selected ? keyExtractor(selected) : null))
            .map((item) => (
              <Menu.Item
                key={keyExtractor(item)}
                onPress={() => {
                  setOpen(false);
                  onPressed(item);
                  setClosing(item);
                  setSelected(item);
                }}
                title={valueExtractor(item)}
              />
            ))}
        </Menu>
      )}
    </Pressable>
  );
};

export default DropdownSelector;
