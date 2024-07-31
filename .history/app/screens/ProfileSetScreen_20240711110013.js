import React from 'react';
import { View, Dimensions, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const renderImageButton = (source, imageStyle, containerStyle, onPress) => (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image source={source} style={imageStyle} resizeMode="contain" />
    </TouchableOpacity>
  );
 renderNewButton = (text, style, onPress, textStyle = {}) => (
    <TouchableOpacity style={[styles.newButton, style]} onPress={onPress}>
      <Text style={[styles.newButtonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
  

  const handleNavigation = async (screenName) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.navigate(screenName, { userId, token });
      } else {
        console.log('Token nenalezen');
      }
    } catch (error) {
      console.error('Chyba při načítání tokenu:', error);
    }
  };

  return (
    <View style={styles.container}>
      {renderImageButton(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { position: 'absolute', top: SCREEN_HEIGHT * -0.009, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        () => handleNavigation('UserScreen')
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
        'Change User Name',
        {
          position: 'absolute',
          top: SCREEN_HEIGHT * 0.20,
          left: SCREEN_WIDTH * 0.20,
          width: SCREEN_WIDTH * 0.6,
          height: SCREEN_HEIGHT * 0.055
        },
        () => handleNavigation('ChangeUserNameScreen')
      )}

      {renderNewButton(
        'Change Region',
        {
          position: 'absolute',
          top: SCREEN_HEIGHT * 0.28,
          left: SCREEN_WIDTH * 0.20,
          width: SCREEN_WIDTH * 0.6,
          height: SCREEN_HEIGHT * 0.055
        },
        () => handleNavigation('ChangeRegionScreen')
      )}
      {renderNewButton(
        'Change Email',
        {
          position: 'absolute',
          top: SCREEN_HEIGHT * 0.36,
          left: SCREEN_WIDTH * 0.20,
          width: SCREEN_WIDTH * 0.6,
          height: SCREEN_HEIGHT * 0.055
        },
        () => handleNavigation('ChangeUserNameScreen')
      )}
      {renderNewButton(
        'Change Password',
        {
          position: 'absolute',
          top: SCREEN_HEIGHT * 0.44,
          left: SCREEN_WIDTH * 0.20,
          width: SCREEN_WIDTH * 0.6,
          height: SCREEN_HEIGHT * 0.055
        },
        () => handleNavigation('ChangeUserNameScreen')
      )}
      {renderNewButton(
  'Subscription',
  {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.56,
    left: SCREEN_WIDTH * 0.20,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: '#FFFF03',
  },
  () => handleNavigation('ChangeUserNameScreen'),  // Přidána čárka zde
  { color: 'black' }
)}
{renderNewButton(
  'Terms and Conditions',
  {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.68,
    left: SCREEN_WIDTH * 0.20,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: '#053453',
  },
  () => handleNavigation('ChangeUserNameScreen'),  // Přidána čárka zde
  { color: 'white' }
)}
{renderNewButton(
  'Contact Form',
  {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.76,
    left: SCREEN_WIDTH * 0.20,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: '#053453',
  },
  () => handleNavigation('ChangeUserNameScreen'),  // Přidána čárka zde
  { color: 'white' }
)}
{renderNewButton(
  'FAQ',
  {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.84,
    left: SCREEN_WIDTH * 0.20,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: '#053453',
  },
  () => handleNavigation('ChangeUserNameScreen'),  // Přidána čárka zde
  { color: 'white' }
)}
{renderNewButton(
  'Logout',
  {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.94,
    left: SCREEN_WIDTH * 0.20,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: '#053453',
  },
  () => handleNavigation('ChangeUserNameScreen'),  // Přidána čárka zde
  { color: 'white' }
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
    backgroundColor: '#4B4B4B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    transform: [{ skewX: '-20deg' }],
  },
  newButtonText: {
    color: 'white',
    fontSize: 18,
    transform: [{ skewX: '20deg' }],
  },
});

export default ProfileSetScreen;