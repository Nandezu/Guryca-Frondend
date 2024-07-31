import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.106:8000/user/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('UserScreen', { userId: data.user_id });
      } else {
        Alert.alert('Login failed', data.error || 'Please check your credentials and try again.');
      }
    } catch (error) {
      Alert.alert('Login failed', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
          placeholderTextColor="#fff"
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
          secureTextEntry
        />
      </View>
      <View style={styles.line} />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleButton} onPress={() => alert('Login with Apple')}>
        <Image source={require('../../assets/images/Apple.png')} style={styles.buttonImage} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.googleButton} onPress={() => alert('Login with Google')}>
        <Image source={require('../../assets/images/Google.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={() => alert('Forgot Password')}>
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
    backgroundColor: '#04011A',
    position: 'relative',
  },
  circleContainer: {
    position: 'absolute',
    top: -130,
    left: '50%',
    transform: [{ translateX: -132 }],
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
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    transform: [{ translateX: -64 }],
  },
  or: {
    position: 'absolute',
    top: 630,
    left: '50%',
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
    transform: [{ translateX: -10 }],
  },
  subtitle: {
    position: 'absolute',
    top: 250,
    left: '50%',
    color: '#fff',
    fontSize: 16,
    transform: [{ translateX: -140 }],
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
  input: {
    color: '#fff',
    fontSize: 20,
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
  loginButton: {
    position: 'absolute',
    top: 515,
    left: '50%',
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -90 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  appleButton: {
    position: 'absolute',
    top: 670,
    left: '50%',
    width: 60,
    height: 60,
    transform: [{ translateX: -122 }],
  },
  googleButton: {
    position: 'absolute',
    top: 670,
    left: '50%',
    width: 60,
    height: 60,
    transform: [{ translateX: +65 }],
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
  },
  forgotPasswordContainer: {
    position: 'absolute',
    top: 440,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -70 }],
    alignItems: 'center',
  },
  signUpContainer: {
    position: 'absolute',
    top: 568,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -144 }],
    alignItems: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 10,
  },
});
