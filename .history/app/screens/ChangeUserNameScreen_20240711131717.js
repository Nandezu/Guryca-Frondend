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
      <TouchableOpacity style={styles.button} onPress={handleChangeUserName}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
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
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ChangeUserNameScreen;
