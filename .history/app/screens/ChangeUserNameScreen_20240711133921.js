import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeUserNameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, token } = route.params || {};  // Přidána kontrola pro route.params

  const [newUserName, setNewUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangeUserName = async () => {
    if (!newUserName || !password || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setMessage('User not authenticated.');
        return;
      }

      const response = await axios.post(
        `http://192.168.0.106:8000/user/change_username/`,
        {
          newUserName,
          password
        },
        {
          headers: { 'Authorization': `Token ${token}` }
        }
      );

      if (response.status === 200) {
        setMessage('Username changed successfully!');
        setTimeout(() => {
          setNewUserName('');
          setPassword('');
          setConfirmPassword('');
          setMessage('');
          navigation.navigate('ProfileSetScreen', { userId, token });
        }, 2000);
      } else {
        setMessage('Failed to change username. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setMessage('Error: ' + (error.response.data.detail || JSON.stringify(error.response.data)));
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('Failed to change username. Please try again.');
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
      <Text style={styles.subtitle}>Your First AI-Powered Fashion Assistant</Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Change User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="New User Name"
          placeholderTextColor="#fff"
          value={newUserName}
          onChangeText={setNewUserName}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#fff"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          />
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
  
        <TouchableOpacity style={styles.smallButton} onPress={handleChangeUserName}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    top: 160,
    left: '50%',
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    transform: [{ translateX: -42 }],
  },
  subtitle: {
    position: 'absolute',
    top: 215,
    left: '50%',
    color: '#fff',
    fontSize: 16,
    transform: [{ translateX: -120 }],
  },
  formContainer: {
    marginTop: 250, // Adjust this value as needed to move the form down
  },
  title: {
    color: '#fff',
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
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ChangeUserNameScreen;
