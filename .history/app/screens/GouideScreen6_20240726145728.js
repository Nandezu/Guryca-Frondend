import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GuideScreen6 = ({ route }) => {
  const { userId } = route.params;
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setMessage('No authentication token found. Please log in again.');
          return;
        }

        const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        const { username } = response.data;
        setUsername(username);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          setMessage('Authentication failed. Please log in again.');
        } else {
          setMessage('Failed to load user data. Please try again.');
        }
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (username) {
      const timer = setTimeout(() => {
        navigation.navigate('LoginScreen', { userId });
      }, 400000);
      return () => clearTimeout(timer);
    }
  }, [username, navigation, userId]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.helloText]}>Hello, {username}!</Text>
      <Text style={[styles.text, styles.additionalText]}>
        Welcome to Nandezu!
      </Text>
      <Text style={[styles.text, styles.thirdText]}>
        I'm your AI fashion assistant.
        All advice regarding the use of the application can be
        found in the profile section under FAQ.
      </Text>
      {message ? <Text style={[styles.text, styles.error]}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    position: 'absolute',
    color: '#fff',
  },
  helloText: {
    top: 250,
    left: 40,
    fontSize: 24,
  },
  additionalText: {
    top: 400,
    left: 40,
    fontSize: 24,
  },
  thirdText: {
    top: 470,
    left: 40,
    fontSize: 15,
  },
  error: {
    color: 'red',
    bottom: 50,
    fontSize: 16,
  },
});

export default GuideScreen6;