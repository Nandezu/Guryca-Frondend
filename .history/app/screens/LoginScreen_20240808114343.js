import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@config';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log('Attempting login with:', { username, password: '*'.repeat(password.length) });
     
      const response = await fetch(`${BASE_URL}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
 
      console.log('Response status:', response.status);
     
      const data = await response.json();
      console.log('Response data:', data);
 
      if (response.ok) {
        console.log('Login successful, saving token');
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userId', data.user_id.toString());
        console.log('Token and userId saved, navigating to UserScreen');
        navigation.navigate('UserScreen', { userId: data.user_id });
      } else {
        console.log('Login failed:', data.error);
        Alert.alert('Login failed', data.error || 'Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Linking.openURL('https://www.nandezu.com/password');
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circleOuter]} />
        <View style={[styles.circle, styles.circleMiddle]} />
        <View style={[styles.circle, styles.circleInner]} />
      </View>
      <Text style={styles.appName}>NANDEZU</Text>
      <Text style={styles.or}>or</Text>
      <Text style={styles.subtitle}>Your First AI-Powered Fashion Assistant</Text>

      <View style={styles.emailContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          placeholderTextColor="#000"
        />
      </View>
      <View style={styles.line} />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#000"
          secureTextEntry
        />
      </View>
      <View style={styles.line} />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.textButton}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signUpContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Signupscreen')}>
          <Text style={styles.textButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE',
    position: 'relative',
  },
  circleContainer: {
    position: 'absolute',
    top: -130,
    left: '50%',
    transform: [{ translateX: -141 }],
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
    top: 190,
    left: '50%',
    color: '#000',
    fontSize: 30,
    fontWeight: '300',
    transform: [{ translateX: -66 }],
  },
  or: {
    position: 'absolute',
    top: 610,
    left: '50%',
    color: '#000',
    fontSize: 20,
    fontWeight: '300',
    transform: [{ translateX: -10 }],
  },
  subtitle: {
    position: 'absolute',
    top: 250,
    left: '50%',
    color: '#000',
    fontSize: 16,
    transform: [{ translateX: -143 }],
  },
  emailContainer: {
    position: 'absolute',
    top: 350,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -160 }],
    paddingBottom: 2,
  },
  passwordContainer: {
    position: 'absolute',
    top: 420,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -160 }],
    paddingBottom: 2,
  },
  input: {
    color: '#000',
    fontSize: 20,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingLeft: 2,
  },
  line: {
    height: 1,
    backgroundColor: '#000',
    width: '80%',
    alignSelf: 'center',
    marginTop: -1,
  },
  loginButton: {
    position: 'absolute',
    top: 550,
    left: '50%',
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -90 }],
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderText: {
    color: '#000',
    fontSize: 18,
  },
  forgotPasswordContainer: {
    position: 'absolute',
    top: 460,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -75 }],
    alignItems: 'center',
  },
  signUpContainer: {
    position: 'absolute',
    top: 650,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -144 }],
    alignItems: 'center',
  },
  textButton: {
    color: '#000',
    fontSize: 15,
    marginVertical: 10,
  },
});
