import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

export default function ResetPasswordConfirmScreen({ route, navigation }) {
  const { token, email } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      Alert.alert('Error', 'Invalid reset link. Please request a new password reset.');
      navigation.navigate('ForgotPasswordScreen');
    }
  }, [token, email, navigation]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.106:8000/user/reset-password-confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Your password has been reset successfully', [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
        ]);
      } else {
        Alert.alert('Error', data.error || 'An error occurred. Please try again.', [
          { text: 'Try Again', onPress: () => {
            setNewPassword('');
            setConfirmPassword('');
          }}
        ]);
      }
    } catch (error) {
      console.error('Reset password confirm error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return null; // Prevent rendering if token or email is missing
  }

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circleOuter]} />
        <View style={[styles.circle, styles.circleMiddle]} />
        <View style={[styles.circle, styles.circleInner]} />
      </View>
      <Text style={styles.appName}>NANDEFROND</Text>
      <Text style={styles.subtitle}>Reset Your Password</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setNewPassword}
          value={newPassword}
          placeholder="Enter new password"
          placeholderTextColor="#000"
          secureTextEntry
        />
      </View>
      <View style={styles.line} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor="#000"
          secureTextEntry
        />
      </View>
      <View style={styles.line} />

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.buttonText}>Back to Login</Text>
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
    transform: [{ translateX: -69 }],
  },
  subtitle: {
    position: 'absolute',
    top: 250,
    left: '50%',
    color: '#000',
    fontSize: 20,
    transform: [{ translateX: -90 }],
  },
  inputContainer: {
    position: 'absolute',
    top: 350,
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
  resetButton: {
    position: 'absolute',
    top: 460,
    left: '50%',
    width: 200,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -100 }],
  },
  backButton: {
    position: 'absolute',
    top: 520,
    left: '50%',
    width: 200,
    height: 45,
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
});