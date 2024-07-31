import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Screen3({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Screen 3</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
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
