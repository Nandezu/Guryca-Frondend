import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();

  const renderButton = (text, style, onPress) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderButton('Nandezu', {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.01,
        left: SCREEN_WIDTH * 0.330,
        width: SCREEN_WIDTH * 0.35,
        height: SCREEN_HEIGHT * 0.16,
      }, () => navigation.navigate('UserScreen'))}

      {renderButton('Love', {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.052,
        right: SCREEN_WIDTH * 0.05,
        width: SCREEN_WIDTH * 0.07,
        height: SCREEN_HEIGHT * 0.035,
      }, () => console.log('Love pressed'))}

      {renderButton('Subs', {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.050,
        left: SCREEN_WIDTH * 0.050,
        width: SCREEN_WIDTH * 0.08,
        height: SCREEN_HEIGHT * 0.04,
      }, () => console.log('Subs pressed'))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  button: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileSetScreen;