import React from 'react';
import { View, Dimensions, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();

  const renderImageWithTouchable = (
    source,
    imageStyle,
    touchableStyle,
    containerStyle,
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
              borderWidth: 1,
              borderColor: 'red',
              position: 'absolute'
            },
            touchableStyle
          ]}>
            <Image 
              source={source} 
              style={[
                imageStyle,
                {
                  position: 'absolute',
                }
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
        { width: SCREEN_WIDTH * 0.10, height: SCREEN_HEIGHT * 0.05, top: 20, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * -0.008, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'nandezu',
        'UserScreen'
      )}
      {renderImageWithTouchable(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, right: SCREEN_WIDTH * 0.05, zIndex: 2 },
        'love',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        'subs',
        null
      )}

      {/* Nová tlačítka */}
      {renderImageWithTouchable(
        require('../../assets/images/setname.png'),
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.05, top: 15, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.15, left: SCREEN_WIDTH * 0.23 },
        'setname',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setemail.png'),
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15, top: 0, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.40, right: SCREEN_WIDTH * 0.17 },
        'setemail',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setregion.png'),
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15, top: 0, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.35, left: SCREEN_WIDTH * 0.05 },
        'setregion',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setpassword.png'),
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15 },
        { width: SCREEN_WIDTH * 0.5, height: SCREEN_HEIGHT * 0.15, top: 0, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.35, right: SCREEN_WIDTH * 0.05 },
        'setpassword',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setsub.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08, top: 0, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.5, left: SCREEN_WIDTH * 0.05 },
        'setsub',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setterms.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08, top: 0, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.5, right: SCREEN_WIDTH * 0.05 },
        'setterms',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setcontact.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08, top: 0, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.65, left: SCREEN_WIDTH * 0.05 },
        'setcontact',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setfaq.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08, top: 0, left: 0 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.65, right: SCREEN_WIDTH * 0.05 },
        'setfaq',
        null
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setlogout.png'),
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08 },
        { width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.08, top: 0, left: 0 },
        { position: 'absolute', bottom: SCREEN_HEIGHT * 0.05, alignSelf: 'center' },
        'setlogout',
        null
      )}
    </View>
  );
};

export default ProfileSetScreen;
