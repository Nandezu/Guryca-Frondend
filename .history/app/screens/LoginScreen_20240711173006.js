import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.106:8000/user/login/', {
        username: email,
        password: password
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('userToken', response.data.token);
        setMessage('Login successful!');
        setTimeout(() => {
          setEmail('');
          setPassword('');
          setMessage('');
          navigation.navigate('ProfileSetScreen', { userId: response.data.user_id });
        }, 2000);
      } else {
        setMessage('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setMessage('Login failed: ' + (error.response.data.detail || JSON.stringify(error.response.data)));
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('Login failed. Please try again.');
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
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <TouchableOpacity style={styles.smallButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.textButton}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
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
    transform: [{ translateX: -64 }],
  },
  subtitle: {
    position: 'absolute',
    top: 215,
    left: '50%',
    color: '#fff',
    fontSize: 16,
    transform: [{ translateX: -140 }],
  },
  formContainer: {
    marginTop: 250,
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
    padding: 10,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  signupContainer: {
    position: 'absolute',
    top: 690,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -150 }],
    alignItems: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 10,
  },
  message: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LoginScreen;
