import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Screen2({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Screen 2</Text>
      <Button
        title="Go to Screen 3"
        onPress={() => navigation.navigate('Screen3')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
