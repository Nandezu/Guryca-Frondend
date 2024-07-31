import React from 'react';
import { View, Dimensions, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
        console.log('Token nenalezen');
      }
    } catch (error) {
      console.error('Chyba při načítání tokenu:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Odhlášení na backendu
        await axios.post('http://192.168.0.106:8000/logout/', {}, {
          headers: { 'Authorization': `Token ${token}` }
        });

        // Vymazání tokenu z AsyncStorage
        await AsyncStorage.removeItem('userToken');

        // Přesměrování na HomeScreen
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      } else {
        console.log('Token nenalezen');
      }
    } catch (error) {
      console.error('Chyba při odhlašování:', error);
      Alert.alert('Chyba', 'Nepodařilo se odhlásit. Zkuste to prosím znovu.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/setprofile.png')}
        style={styles.iconImage}
      />
      <Image
        source={require('../../assets/images/setglobe.png')}
        style={[styles.iconImage, { top: SCREEN_HEIGHT * 0.29 }]}
      />
      <Image
        source={require('../../assets/images/setoemail.png')}
        style={[styles.iconImage, { top: SCREEN_HEIGHT * 0.37 }]}
      />
      <Image
        source={require('../../assets/images/setpass.png')}
        style={[styles.iconImage, { top: SCREEN_HEIGHT * 0.45 }]}
      />
    
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
        () => handleNavigation('LoveScreen')
      )}

      {renderImageButton(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        () => handleNavigation('SubsScreen')
      )}

      {renderNewButton(
        'Change User Name',
        styles.buttonStyle,
        () => handleNavigation('UserScreen')
      )}

      {renderNewButton(
        'Change Region',
        [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.28 }],
        () => handleNavigation('UserScreen')
      )}

      {renderNewButton(
        'Change Email',
        [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.36 }],
        () => handleNavigation('UserScreen')
      )}

      {renderNewButton(
        'Change Password',
        [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.44 }],
        () => handleNavigation('UserScreen')
      )}

      {renderNewButton(
        'Subscription',
        [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.56, backgroundColor: '#FFFF03' }],
        () => handleNavigation('UserScreen'),
        { color: 'black' }
      )}

      {renderNewButton(
        'Terms and Conditions',
        [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.68, backgroundColor: '#053453' }],
        () => handleNavigation('UserScreen'),
        { color: 'white' }
      )}

      {renderNewButton(
        'Contact Form',
        [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.76, backgroundColor: '#053453' }],
        () => handleNavigation('UserScreen'),
        { color: 'white' }
      )}

      {renderNewButton(
        'FAQ',
        [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.84, backgroundColor: '#053453' }],
        () => handleNavigation('UserScreen'),
        { color: 'white' }
      )}

      {renderNewButton(
        'Logout',
        [styles.buttonStyle, { top: SCREEN_HEIGHT * 0.96, backgroundColor: '#000' }],
        handleLogout,
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