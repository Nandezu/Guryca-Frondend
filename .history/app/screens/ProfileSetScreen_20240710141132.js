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
    name,
    navigateTo,
    touchableArea = { top: 0, bottom: 0, left: 0, right: 0 }
  ) => {
    return (
      <View style={containerStyle}>
        <TouchableWithoutFeedback
          onPress={() => navigateTo && navigation.navigate(navigateTo)}
        >
          <View style={{
            width: imageStyle.width + touchableArea.left + touchableArea.right,
            height: imageStyle.height + touchableArea.top + touchableArea.bottom,
            borderWidth: 1,
            borderColor: 'red',
          }}>
            <Image 
              source={source} 
              style={[
                imageStyle, 
                { 
                  width: imageStyle.width, 
                  height: imageStyle.height,
                  position: 'absolute',
                  top: touchableArea.top,
                  left: touchableArea.left,
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
        { position: 'absolute', top: SCREEN_HEIGHT * -0.008, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'nandezu',
        'UserScreen',
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, right: SCREEN_WIDTH * 0.05, zIndex: 2 },
        'love',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        'subs',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}

      {/* Nová tlačítka */}
      {renderImageWithTouchable(
        require('../../assets/images/setname.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.15, left: SCREEN_WIDTH * 0.23 },
        'setname',
        null,
        { top: -10, bottom: -10, left: -10, right: -10 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setemail.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.40, right: SCREEN_WIDTH * 0.17 },
        'setemail',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setregion.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.35, left: SCREEN_WIDTH * 0.05 },
        'setregion',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setpassword.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.35, right: SCREEN_WIDTH * 0.05 },
        'setpassword',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setsub.png'),
        { width: SCREEN_WIDTH * 0.4, height: SCREEN_HEIGHT * 0.1 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.5, left: SCREEN_WIDTH * 0.05 },
        'setsub',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setterms.png'),
        { width: SCREEN_WIDTH * 0.4, height: SCREEN_HEIGHT * 0.1 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.5, right: SCREEN_WIDTH * 0.05 },
        'setterms',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setcontact.png'),
        { width: SCREEN_WIDTH * 0.4, height: SCREEN_HEIGHT * 0.1 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.65, left: SCREEN_WIDTH * 0.05 },
        'setcontact',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setfaq.png'),
        { width: SCREEN_WIDTH * 0.4, height: SCREEN_HEIGHT * 0.1 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.65, right: SCREEN_WIDTH * 0.05 },
        'setfaq',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
      {renderImageWithTouchable(
        require('../../assets/images/setlogout.png'),
        { width: SCREEN_WIDTH * 0.4, height: SCREEN_HEIGHT * 0.1 },
        { position: 'absolute', bottom: SCREEN_HEIGHT * 0.05, alignSelf: 'center' },
        'setlogout',
        null,
        { top: 1, bottom: 1, left: 1, right: 1 }
      )}
    </View>
  );
};

export default ProfileSetScreen;