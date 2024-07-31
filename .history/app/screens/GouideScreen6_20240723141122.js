import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const GuideScreen6 = ({ route }) => {
  const { userId } = route.params;
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
        const { username } = response.data;
        setUsername(username);
      } catch (error) {
        setMessage('Failed to load user data. Please try again.');
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (username) {
      const timer = setTimeout(() => {
        navigation.navigate('LoginScreen', { userId }); // Přechod na další obrazovku a předání userId
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [username, navigation]);

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
    backgroundColor: '#000', // Přidání černého pozadí pro lepší kontrast
  },
  text: {
    position: 'absolute',
    color: '#fff', // Bílá barva textu
  },
  helloText: {
    top: 250, // Upravte souřadnice od vrchu
    left: 40, // Upravte souřadnice zleva
    fontSize: 24, // Velikost písma pro hello text
  },
  additionalText: {
    top: 400, // Upravte souřadnice od vrchu
    left: 40, // Upravte souřadnice zleva
    fontSize: 24, // Velikost písma pro additional text
  },
  thirdText: {
    top: 470, // Upravte souřadnice od vrchu
    left: 40, // Upravte souřadnice zleva
    fontSize: 18, // Velikost písma pro third text
  },
  error: {
    color: 'red',
    bottom: 50, // Upravte souřadnice odspodu
    fontSize: 16, // Velikost písma pro error text
  },
});

export default GuideScreen6;
