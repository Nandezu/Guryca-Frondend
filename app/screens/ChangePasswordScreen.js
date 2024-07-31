import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@config';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, token } = route.params || {};  // Přidána kontrola pro route.params

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage('All fields are required.');
      return;
    }

    if (newPassword.length < 7) {
      setMessage('New password must be at least 7 characters long.');
      return;
    }

    if (!/\d/.test(newPassword)) {
      setMessage('New password must contain at least one number.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setMessage('User not authenticated.');
        return;
      }

      const response = await axios.post(`${BASE_URL}/user/change_password/`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword
        },
        {
          headers: { 'Authorization': `Token ${token}` }
        }
      );

      if (response.status === 200) {
        setMessage('Password changed successfully!');
        setTimeout(() => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setMessage('');
          navigation.navigate('ProfileSetScreen', { userId, token });
        }, 2000);
      } else {
        setMessage('Failed to change password. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setMessage('Error: ' + (error.response.data.detail || JSON.stringify(error.response.data)));
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('Failed to change password. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circleOuter]} />
        <View style={[styles.circle, styles.circleMiddle]} />
        <View style={[styles.circle, styles.circleInner]} />
      </View>
      <Text style={styles.appName}>NANDEZU</Text>
      {!isKeyboardVisible && <Text style={styles.subtitle}>Your First AI-Powered Fashion Assistant</Text>}

      <View style={styles.formContainer}>
        <Text style={styles.title}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          placeholderTextColor="#fff"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#fff"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#fff"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <TouchableOpacity style={styles.smallButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE',
    position: 'relative',
    justifyContent: 'center',
    padding: 20,
  },
  circleContainer: {
    position: 'absolute',
    top: -140,
    left: '50%',
    transform: [{ translateX: -112 }],
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circleOuter: {
    width: 280,
    height: 280,
    backgroundColor: '#849CFC',
  },
  circleMiddle: {
    width: 240,
    height: 240,
    backgroundColor: '#6785FF',
    top: 20,
    left: 20,
  },
  circleInner: {
    width: 200,
    height: 200,
    backgroundColor: '#2450FF',
    top: 40,
    left: 40,
  },
  appName: {
    position: 'absolute',
    top: 180,
    left: '50%',
    color: '#000',
    fontSize: 30,
    fontWeight: '300',
    transform: [{ translateX: -42 }],
  },
  subtitle: {
    position: 'absolute',
    top: 245,
    left: '50%',
    color: '#000',
    fontSize: 16,
    transform: [{ translateX: -120 }],
  },
  formContainer: {
    marginTop: 250, // Adjust this value as needed to move the form down
  },
  title: {
    color: '#000',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  smallButton: {
    backgroundColor: '#1E90FF',
    padding: 10, // Celkový padding
    paddingVertical: 10, // Snížení svislého paddingu
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30, // Větší mezera nad tlačítkem
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ChangePasswordScreen;
