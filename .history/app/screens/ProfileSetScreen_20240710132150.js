import React from 'react';
import { View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();

  const renderImageWithTouchableOpacity = (
    source,
    imageStyle,
    touchableStyle,
    name,
    containerStyle,
    navigateTo
  ) => {
    return (
      <View style={containerStyle}>
        <TouchableOpacity
          style={{
            ...touchableStyle,
            borderWidth: 1,
            borderColor: 'red',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}
          onPress={() => navigateTo && navigation.navigate(navigateTo)}
        >
          <Image source={source} style={imageStyle} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Existující tlačítka */}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        'nandezu',
        { position: 'absolute', top: 10, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        'love',
        { position: 'absolute', top: 40, right: 20, zIndex: 2 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        'subs',
        { position: 'absolute', top: 40, left: 20, zIndex: 2 },
        null
      )}

      {/* Nová tlačítka */}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setname.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setname',
        { position: 'absolute', top: 150, left: 20, zIndex: 3 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setemail.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setemail',
        { position: 'absolute', top: 150, right: 20, zIndex: 3 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setregion.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setregion',
        { position: 'absolute', top: 270, left: 20, zIndex: 3 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setpassword.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setpassword',
        { position: 'absolute', top: 270, right: 20, zIndex: 3 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setsub.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setsub',
        { position: 'absolute', top: 390, left: 20, zIndex: 3 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setterms.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setterms',
        { position: 'absolute', top: 390, right: 20, zIndex: 3 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setcontact.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setcontact',
        { position: 'absolute', top: 510, left: 20, zIndex: 3 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setfaq.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setfaq',
        { position: 'absolute', top: 510, right: 20, zIndex: 3 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setlogout.png'),
        { width: 200, height: 100 },
        { width: 200, height: 100 },
        'setlogout',
        { position: 'absolute', bottom: 20, alignSelf: 'center', zIndex: 3 },
        null
      )}
    </View>
  );
};

export default ProfileSetScreen;