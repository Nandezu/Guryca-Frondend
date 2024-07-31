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
          style={touchableStyle}
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
        { position: 'absolute', top: SCREEN_HEIGHT * -0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        'love',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, left: SCREEN_WIDTH * 0.88, zIndex: 2 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        'subs',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        null
      )}

      {/* Nová tlačítka */}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setname.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setname',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.2, left: SCREEN_WIDTH * 0.1 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setemail.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setemail',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.2, right: SCREEN_WIDTH * 0.1 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setregion.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setregion',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.35, left: SCREEN_WIDTH * 0.1 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setpassword.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setpassword',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.35, right: SCREEN_WIDTH * 0.1 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setsub.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setsub',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.5, left: SCREEN_WIDTH * 0.1 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setterms.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setterms',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.5, right: SCREEN_WIDTH * 0.1 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setcontact.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setcontact',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.65, left: SCREEN_WIDTH * 0.1 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setfaq.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setfaq',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.65, right: SCREEN_WIDTH * 0.1 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/setlogout.png'),
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.1 },
        'setlogout',
        { position: 'absolute', bottom: SCREEN_HEIGHT * 0.05, alignSelf: 'center' },
        null
      )}
    </View>
  );
};

export default ProfileSetScreen;