import React from 'react';
import { View, Dimensions, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();

  const renderImageWithTouchableOpacity = (
    source,
    imageStyle,
    touchableStyle,
    name,
    navigateTo
  ) => {
    return (
      <View style={[styles.touchableWrapper, touchableStyle]}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigateTo && navigation.navigate(navigateTo)}
        >
          <Image source={source} style={imageStyle} resizeMode="contain" />
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
        { position: 'absolute', top: SCREEN_HEIGHT * 0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'nandezu',
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, right: SCREEN_WIDTH * 0.05, zIndex: 2 },
        'love',
        null
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
  touchableWrapper: {
    borderWidth: 2,
    borderColor: 'red',
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileSetScreen;