import React from 'react';
import { View, Dimensions, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();

  const renderImageButton = (source, imageStyle, containerStyle, onPress) => (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image source={source} style={imageStyle} resizeMode="contain" />
    </TouchableOpacity>
  );

  const renderNewButton = (text, style, onPress) => (
    <TouchableOpacity style={[styles.newButton, style]} onPress={onPress}>
      <Text style={styles.newButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderImageButton(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { position: 'absolute', top: SCREEN_HEIGHT * -0.009, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        () => navigation.navigate('UserScreen')
      )}

      {renderImageButton(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, right: SCREEN_WIDTH * 0.05, zIndex: 2 },
        () => console.log('Love pressed')
      )}

      {renderImageButton(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        () => console.log('Subs pressed')
      )}

      {renderNewButton(
        'Set Name',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.2, left: SCREEN_WIDTH * 0.05 },
        () => console.log('Nové tlačítko pressed')
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  newButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  newButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileSetScreen;