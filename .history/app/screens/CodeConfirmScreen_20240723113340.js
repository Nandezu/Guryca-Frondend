import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function CodeConfirmScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState('');

  const handleConfirm = async () => {
    try {
      const response = await axios.post('http://your-backend-url/api/confirm-email/', {
        email,
        confirmation_code: code
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Email confirmed successfully');
        navigation.navigate('AfterRegistration', { email: email });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Confirmation failed');
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await axios.post('http://your-backend-url/api/resend-confirmation/', {
        email
      });
      if (response.status === 200) {
        Alert.alert('Success', 'New confirmation code sent to your email');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend confirmation code');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter the confirmation code sent to {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmation Code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
        <Text style={styles.resendButtonText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#CFD6DE',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2450FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resendButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#2450FF',
    fontSize: 16,
  },
});