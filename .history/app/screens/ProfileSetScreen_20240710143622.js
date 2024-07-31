import React from 'react';
import { View, StyleSheet, Dimensions, Image, PanResponder } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const images = [
  {
    src: require('../../assets/images/nandezu.png'),
    size: { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
    initialPosition: { top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
    key: 'treti',
    style: { position: 'absolute', top: SCREEN_HEIGHT * -0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
    screen: 'UserScreen'
  },
  {
    src: require('../../assets/images/love.png'),
    size: { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
    initialPosition: { top: SCREEN_HEIGHT * 0.052, left: SCREEN_WIDTH * 0.88 },
    key: 'loves',
    style: { position: 'absolute', zIndex: 2 }
  },
  {
    src: require('../../assets/images/subs.png'),
    size: { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
    initialPosition: { top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050 },
    key: 'subs',
    style: { position: 'absolute', zIndex: 2 }
  },
  // Přidání dalších obrázků dle potřeby
  {
    src: require('../../assets/images/setterms.png'),
    size: { width: SCREEN_WIDTH * 0.15, height: SCREEN_HEIGHT * 0.1 },
    initialPosition: { top: SCREEN_HEIGHT * 0.2, left: SCREEN_WIDTH * 0.1 },
    key: 'image4',
    style: { position: 'absolute', zIndex: 2 }
  },
  {
    src: require('../../assets/images/setsub.png'),
    size: { width: SCREEN_WIDTH * 0.15, height: SCREEN_HEIGHT * 0.1 },
    initialPosition: { top: SCREEN_HEIGHT * 0.2, left: SCREEN_WIDTH * 0.3 },
    key: 'image5',
    style: { position: 'absolute', zIndex: 2 }
  },
  {
    src: require('../../assets/images/setpassword.png'),
    size: { width: SCREEN_WIDTH * 0.15, height: SCREEN_HEIGHT * 0.1 },
    initialPosition: { top: SCREEN_HEIGHT * 0.2, left: SCREEN_WIDTH * 0.5 },
    key: 'image6',
    style: { position: 'absolute', zIndex: 2 }
  },
  {
    src: require('../../assets/images/setregion.png'),
    size: { width: SCREEN_WIDTH * 0.15, height: SCREEN_HEIGHT * 0.1 },
    initialPosition: { top: SCREEN_HEIGHT * 0.4, left: SCREEN_WIDTH * 0.1 },
    key: 'image7',
    style: { position: 'absolute', zIndex: 2 }
  },
  {
    src: require('../../assets/images/setemail.png'),
    size: { width: SCREEN_WIDTH * 0.15, height: SCREEN_HEIGHT * 0.1 },
    initialPosition: { top: SCREEN_HEIGHT * 0.4, left: SCREEN_WIDTH * 0.3 },
    key: 'image8',
    style: { position: 'absolute', zIndex: 2 }
  },
  {
    src: require('../../assets/images/setname.png'),
    size: { width: SCREEN_WIDTH * 0.15, height: SCREEN_HEIGHT * 0.1 },
    initialPosition: { top: SCREEN_HEIGHT * 0.4, left: SCREEN_WIDTH * 0.5 },
    key: 'image9',
    style: { position: 'absolute', zIndex: 2 }
  },
];

const renderImageWithTouchableOpacity = (source, size, initialPosition, key, style, screen) => {
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        this[`_${key}`].setNativeProps({
          style: {
            left: initialPosition.left + gestureState.dx,
            top: initialPosition.top + gestureState.dy,
          },
        });
      },
    })
  ).current;

  return (
    <View
      key={key}
      ref={component => (this[`_${key}`] = component)}
      {...panResponder.panHandlers}
      style={[styles.imageContainer, initialPosition]}
    >
      <Image source={source} style={[size, style]} />
    </View>
  );
};

const ProfileSetScreen = () => {
  return (
    <View style={styles.container}>
      {images.map((image) =>
        renderImageWithTouchableOpacity(
          image.src,
          image.size,
          image.initialPosition,
          image.key,
          image.style,
          image.screen
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    position: 'absolute',
    zIndex: 2,
  },
});

export default ProfileSetScreen;
