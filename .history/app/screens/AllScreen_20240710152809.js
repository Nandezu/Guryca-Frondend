import React, { useState } from 'react';
import { View, Dimensions, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();
  const [pressed, setPressed] = useState({});

  const renderImageWithTouchableOpacity = (
    imageSource,
    imageStyle,
    touchableStyle,
    pressedKey,
    containerStyle,
    navigateTo
  ) => {
    let pressTimer;

    return (
      <View style={[styles.imageWrapper, containerStyle]}>
        <Image
          source={imageSource}
          style={[styles.image, imageStyle, pressed[pressedKey] && styles.pressedImage]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, touchableStyle]}
          onPressIn={() => {
            pressTimer = setTimeout(() => setPressed({ ...pressed, [pressedKey]: true }), 70);
          }}
          onPressOut={() => {
            clearTimeout(pressTimer);
            setPressed({ ...pressed, [pressedKey]: false });
          }}
          onPress={() => {
            if (pressed[pressedKey] && navigateTo) {
              navigation.navigate(navigateTo);
            }
          }}
        >
          <View style={styles.touchableIndicator} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Existující tlačítka */}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        'nandezu',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'UserScreen'
      )}

      {/* Nová tlačítka s upraveným formátem */}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setname.png'),
        { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.370 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
        'setname',
        { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.026, left: SCREEN_WIDTH * -0.17 },
        'SetNameScreen'
      )}

      {/* Přidejte další tlačítka podle potřeby */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    // Základní styl pro obrázky
  },
  pressedImage: {
    opacity: 0.5,
  },
  button: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  touchableIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 2,
  },
});

export default ProfileSetScreen;