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
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { 
          position: 'absolute', 
          top: SCREEN_HEIGHT * 0.01, 
          left: SCREEN_WIDTH * 0.330, 
          zIndex: 2,
          width: SCREEN_WIDTH * 0.4,
          height: SCREEN_HEIGHT * 0.2
        },
        'nandezu',
        'UserScreen'
      )}
      
      {renderImageWithTouchableOpacity(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { 
          position: 'absolute', 
          top: SCREEN_HEIGHT * 0.052, 
          right: SCREEN_WIDTH * 0.05, 
          zIndex: 2,
          width: SCREEN_WIDTH * 0.1,
          height: SCREEN_HEIGHT * 0.05
        },
        'love',
        null
      )}
      
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { 
          position: 'absolute', 
          top: SCREEN_HEIGHT * 0.050, 
          left: SCREEN_WIDTH * 0.050, 
          zIndex: 2,
          width: SCREEN_WIDTH * 0.12,
          height: SCREEN_HEIGHT * 0.06
        },
        'subs',
        null
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/setname.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { 
          position: 'absolute', 
          top: SCREEN_HEIGHT * 0.2, 
          left: SCREEN_WIDTH * 0.05,
          width: SCREEN_WIDTH * 0.7,
          height: SCREEN_HEIGHT * 0.25
        },
        'setname',
        null
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/setemail.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { 
          position: 'absolute', 
          top: SCREEN_HEIGHT * 0.20, 
          right: SCREEN_WIDTH * 0.05,
          width: SCREEN_WIDTH * 0.4,
          height: SCREEN_HEIGHT * 0.05
        },
        'setemail',
        null
      )}

      {/* Přidejte další tlačítka podle potřeby, s nastavením velikosti TouchableOpacity */}

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