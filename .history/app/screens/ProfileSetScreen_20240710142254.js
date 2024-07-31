import React from 'react';
import { View, Dimensions, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();

  const renderImageWithTouchable = (
    source,
    imageStyle,
    containerStyle,
    touchableStyle,
    touchablePosition,
    imagePosition,
    name,
    navigateTo
  ) => {
    return (
      <View style={containerStyle}>
        <TouchableWithoutFeedback
          onPress={() => navigateTo && navigation.navigate(navigateTo)}
        >
          <View style={[
            {
              position: 'absolute',
              borderWidth: 1,
              borderColor: 'red',
            },
            touchableStyle,
            touchablePosition
          ]}>
            <Image 
              source={source} 
              style={[
                imageStyle,
                {
                  position: 'absolute',
                },
                imagePosition
              ]}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Existující tlačítka */}
      {renderImageWithTouchable(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { position: 'absolute', top: SCREEN_HEIGHT * -0.008, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { top: 0, left: 0 },
        { top: 0, left: 0 },
        'nandezu',
        'UserScreen'
      )}
      {renderImageWithTouchable(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, right: SCREEN_WIDTH * 0.05, zIndex: 2 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { top: 0, left: 0 },
        { top: 0, left: 0 },
        'love',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { top: 0, left: 0 },
        { top: 0, left: 0 },
        'subs',
        null
      )}

      {/* Nová tlačítka */}
      {renderImageWithTouchable(
        require('../../assets/images/setname.png'),
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.15, left: SCREEN_WIDTH * 0.23 },
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { top: 10, left: 0 },
        { top: 10, left: 10 },
        'setname',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setemail.png'),
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.40, right: SCREEN_WIDTH * 0.17 },
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { top: 0, left: 0 },
        { top: 10, left: 10 },
        'setemail',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setregion.png'),
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.35, left: SCREEN_WIDTH * 0.05 },
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { top: 0, left: 0 },
        { top: 10, left: 10 },
        'setregion',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setpassword.png'),
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.35, right: SCREEN_WIDTH * 0.05 },
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { top: 0, left: 0 },
        { top: 10, left: 10 },
        'setpassword',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setsub.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.5, left: SCREEN_WIDTH * 0.05 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { top: 0, left: 0 },
        { top: 5, left: 5 },
        'setsub',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setterms.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.5, right: SCREEN_WIDTH * 0.05 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { top: 0, left: 0 },
        { top: 5, left: 5 },
        'setterms',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setcontact.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.65, left: SCREEN_WIDTH * 0.05 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { top: 0, left: 0 },
        { top: 5, left: 5 },
        'setcontact',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setfaq.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.65, right: SCREEN_WIDTH * 0.05 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { top: 0, left: 0 },
        { top: 5, left: 5 },
        'setfaq',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setlogout.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { position: 'absolute', bottom: SCREEN_HEIGHT * 0.05, alignSelf: 'center' },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { top: 0, left: 0 },
        { top: 5, left: 5 },
        'setlogout',
        null
      )}
    </View>
  );
};

export default ProfileSetScreen;
