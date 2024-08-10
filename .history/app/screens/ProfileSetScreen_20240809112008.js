import React, { useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Linking } from 'react-native';
import { BASE_URL } from '@config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSetScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  useEffect(() => {
    console.log('ProfileSetScreen - userId:', userId);
  }, [userId]);

  const renderImageButton = (source, imageStyle, containerStyle, onPress) => (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image source={source} style={imageStyle} resizeMode="contain" />
    </TouchableOpacity>
  );

  const renderNewButton = (text, style, onPress, textStyle = {}) => (
    <TouchableOpacity style={[styles.newButton, style]} onPress={onPress}>
      <Text style={[styles.newButtonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );

  const handleNavigation = async (screenName) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        console.log(`Navigating to ${screenName} with userId: ${userId} and token: ${token}`);
        navigation.navigate(screenName, { userId, token });
      } else {
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Error loading token:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await axios.post(`${BASE_URL}/user/logout/`, {}, {
          headers: { 'Authorization': `Token ${token}` }
        });
        await AsyncStorage.removeItem('userToken');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/setprofile.png')} style={styles.iconImage} />
      <Image source={require('../../assets/images/setglobe.png')} style={[styles.iconImage, { top: SCREEN_HEIGHT * 0.29 }]} />
      <Image source={require('../../assets/images/setoemail.png')} style={[styles.iconImage, { top: SCREEN_HEIGHT * 0.37 }]} />
      <Image source={require('../../assets/images/setpass.png')} style={[styles.iconImage, { top: SCREEN_HEIGHT * 0.45 }]} />
    
      {renderImageButton(
        require('../../assets/images/nandezud.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { position: 'absolute', top: SCREEN_HEIGHT * -0.05, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        () => navigation.navigate('UserScreen', { userId })
      )}

      {renderImageButton(
        require('../../assets/images/loved.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.010, right: SCREEN_WIDTH * 0.05, zIndex: 2 },
        () => handleNavigation('ManageProfilePictures')
      )}

      {renderImageButton(
        require('../../assets/images/subsd.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.0105, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        () => navigation.goBack()
      )}

      {renderNewButton('Change User Name', styles.buttonStyle, () => handleNavigation('ChangeUserNameScreen'))}
      {renderNewButton('Change Region', [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.12 }], () => handleNavigation('ChangeRegionScreen'))}
      {renderNewButton('Change Email', [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.28 }], () => handleNavigation('ChangeEmailScreen'))}
      {renderNewButton('Change Password', [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.36 }], () => handleNavigation('ChangePasswordScreen'))}
      {renderNewButton('Subscription', [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.50, backgroundColor: '#FFFF03' }], () => navigation.navigate('SubScreen', { userId }), { color: 'black' })}
      {renderNewButton('Terms and Conditions', [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.68, backgroundColor: '#053453' }], () => Linking.openURL('https://www.nandezu.com/terms-and-coniditions'), { color: 'white' })}
      {renderNewButton('Contact Form', [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.76, backgroundColor: '#053453' }], () => Linking.openURL('https://www.nandezu.com/contact'), { color: 'white' })}
      {renderNewButton('FAQ', [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.84, backgroundColor: '#053453' }], () => Linking.openURL('https://www.nandezu.com/faq'), { color: 'white' })}
      {renderNewButton('Logout', [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.92, backgroundColor: '#CFD6DE' }], handleLogout, { color: 'black' })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE',
  },
  iconImage: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.21,
    left: SCREEN_WIDTH * 0.08,
    width: SCREEN_WIDTH * 0.070,
    height: SCREEN_HEIGHT * 0.035,
    resizeMode: 'contain',
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
  buttonStyle: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.20,
    left: SCREEN_WIDTH * 0.22,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.055
  },
});

export default ProfileSetScreen;
