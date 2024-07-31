import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.106:8000';

export default function CodeConfirmScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the confirmation code');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/confirm-email/`, {
        email,
        confirmation_code: code
      });
  
      if (response.status === 200) {
        const { user_id, token } = response.data;  // Předpokládáme, že backend vrací user_id a token
        
        // Uložení tokenu a user_id do AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', user_id.toString());
  
        Alert.alert('Success', 'Email confirmed successfully. You can now proceed with photo upload.');
        navigation.navigate('UploadPhoto', { userId: user_id });
      }
    } catch (error) {
      console.error('Error during confirmation:', error.response?.data);
      Alert.alert('Error', error.response?.data?.error || 'Confirmation failed', [
        { text: 'Try Again', onPress: () => setCode('') }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/resend-confirmation/`, {
        email
      });

      if (response.status === 200) {
        Alert.alert('Success', 'New confirmation code sent to your email');
        setCode('');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to resend confirmation code');
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
      <Text style={styles.subtitle}>Confirm Your Email</Text>
      <Text style={styles.text}>Enter the confirmation code sent to {email}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmation Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          placeholderTextColor="#000"
        />
      </View>
      <View style={styles.line} />
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Confirming...' : 'Confirm'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resendButton} onPress={handleResendCode} disabled={loading}>
        <Text style={styles.resendButtonText}>{loading ? 'Sending...' : 'Resend Code'}</Text>
      </TouchableOpacity>
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
    transform: [{ translateX: -138 }],
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
    transform: [{ translateX: -65 }],
  },
  subtitle: {
    position: 'absolute',
    top: 280,
    left: '50%',
    color: '#000',
    fontSize: 20,
    transform: [{ translateX: -85 }],
  },
  text: {
    position: 'absolute',
    top: 380,
    left: '50%',
    fontSize: 16,
    textAlign: 'center',
    transform: [{ translateX: -150 }],
    width: 300,
  },
  inputContainer: {
    position: 'absolute',
    top: 500,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -148 }],
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
  confirmButton: {
    position: 'absolute',
    top: 610,
    left: '50%',
    width: 150,
    height: 35,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -100 }],
  },
  resendButton: {
    position: 'absolute',
    top: 680,
    left: '50%',
    width: 150,
    height: 35,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -100 }],
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
  resendButtonText: {
    color: '#000',
    fontSize: 18,
  },
});