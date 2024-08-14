import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@config';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

        const response = await axios.get(`${BASE_URL}/user/users/${userId}/`, {
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
      }, 7000);
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
        I'm your AI fashion assistant.{'\n'}
        All advice regarding the use of the {'\n'}
        application can be found in the  {'\n'}
        profile section under FAQ.
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
    top: SCREEN_HEIGHT * 0.3,
    left: 40,
    fontSize: 24,
  },
  additionalText: {
    top: SCREEN_HEIGHT * 0.48,
    left: 40,
    fontSize: 24,
  },
  thirdText: {
    top: SCREEN_HEIGHT * 0.62,
    left: 40,
    fontSize: 15,
    lineHeight: 22,
  },
  error: {
    color: 'red',
    bottom: SCREEN_HEIGHT * 0.06,
    fontSize: 16,
  },
});

export default GuideScreen6;