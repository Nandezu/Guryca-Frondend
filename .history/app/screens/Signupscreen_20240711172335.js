import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking, Switch } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false); // State for terms and conditions agreement
  const [message, setMessage] = useState('');

  const validatePassword = (password) => {
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    return password.length >= 7 && hasNumber.test(password) && hasUpperCase.test(password);
  };

  const handleRegister = async () => {
    if (!nickname || !email || !password || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }

    if (nickname.length > 20) {
      setMessage('Username cannot be more than 20 characters.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Invalid email format.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be at least 7 characters, include a number and an uppercase letter.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!agreedToTerms) {
      setMessage('You must agree to the terms and conditions.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.106:8000/user/users/', {
        username: nickname,
        email,
        password
      });

      if (response.status === 201) {
        setMessage('Registration successful!');
        setTimeout(() => {
          setNickname('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setMessage('');
          navigation.navigate('AfterRegistration', { userId: response.data.id });
        }, 3000);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setMessage('Registration failed: ' + (error.response.data.detail || JSON.stringify(error.response.data)));
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('Registration failed. Please try again.');
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
      <Text style={styles.or}>or</Text>
      <Text style={styles.subtitle}>Your First AI-Powered Fashion Assistant</Text>

      <View style={styles.nicknameContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setNickname}
          value={nickname}
          placeholder="Nickname"
          placeholderTextColor="#fff"
          placeholderStyle={styles.placeholderText}
        />
      </View>
      <View style={styles.line} />

      <View style={styles.emailContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="#fff"
          placeholderStyle={styles.placeholderText}
        />
      </View>
      <View style={styles.line} />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#fff"
          placeholderStyle={styles.placeholderText}
          secureTextEntry
        />
      </View>
      <View style={styles.line} />

      <View style={styles.confirmPasswordContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#fff"
          placeholderStyle={styles.placeholderText}
          secureTextEntry
        />
      </View>
      <View style={styles.line} />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {!message && (
        <View style={styles.termsContainer}>
          <Switch
            value={agreedToTerms}
            onValueChange={setAgreedToTerms}
            thumbColor={agreedToTerms ? '#fff' : '#fff'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('https://www.nandezu.com/terms-and-conditions')}>
              terms and conditions
            </Text>
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.textButton}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  circleContainer: {
    position: 'absolute',
    top: -140,
    left: '50%',
    transform: [{ translateX: -130 }],
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
  or: {
    position: 'absolute',
    top: 660,
    left: '50%',
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
    transform: [{ translateX: -20 }],
  },
  subtitle: {
    position: 'absolute',
    top: 215,
    left: '50%',
    color: '#fff',
    fontSize: 16,
    transform: [{ translateX: -140 }],
  },
  nicknameContainer: {
    position: 'absolute',
    top: 260,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -160 }],
    paddingBottom: 2,
  },
  emailContainer: {
    position: 'absolute',
    top: 330,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -160 }],
    paddingBottom: 2,
  },
  passwordContainer: {
    position: 'absolute',
    top: 400,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -160 }],
    paddingBottom: 2,
  },
  confirmPasswordContainer: {
    position: 'absolute',
    top: 470,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -160 }],
    paddingBottom: 2,
  },
  input: {
    color: '#fff',
    fontSize: 15,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingLeft: 2,
  },
  line: {
    height: 1,
    backgroundColor: '#fff',
    width: '80%',
    alignSelf: 'center',
    marginTop: -1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 530,
    marginLeft: 20, // Adjust this value to move it further to the right
  },
  termsText: {
    color: '#fff',
    marginLeft: 10,
  },
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    position: 'absolute',
    top: 600,
    left: '50%',
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -100 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loginContainer: {
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
    position: 'absolute',
    top: 520,
    left: '50%',
    color: 'red',
    fontSize: 16,
    transform: [{ translateX: -160 }],
    alignSelf: 'center',
    textAlign: 'center',
    width: '80%',
  },
});
