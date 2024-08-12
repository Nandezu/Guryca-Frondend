import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [message, setMessage] = useState('');

  const validatePassword = (password) => {
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    return password.length >= 7 && hasNumber.test(password) && hasUpperCase.test(password);
  };

  const handleContinue = () => {
    if (!nickname || !email || !password || !confirmPassword) {
      setMessage('Všechna pole jsou povinná.');
      return;
    }

    if (nickname.length > 20) {
      setMessage('Uživatelské jméno nemůže být delší než 20 znaků.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Neplatný formát e-mailu.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Heslo musí mít alespoň 7 znaků, obsahovat číslo a velké písmeno.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Hesla se neshodují.');
      return;
    }

    if (!agreedToTerms) {
      setMessage('Musíte souhlasit s podmínkami použití.');
      return;
    }

    navigation.navigate('AfterRegistration', {
      nickname,
      email,
      password
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circleOuter]} />
        <View style={[styles.circle, styles.circleMiddle]} />
        <View style={[styles.circle, styles.circleInner]} />
      </View>
      <Text style={styles.appName}>NANDEZU</Text>
      <Text style={styles.subtitle}>Váš první AI módní asistent</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setNickname}
          value={nickname}
          placeholder="Přezdívka"
          placeholderTextColor="#000"
        />
      </View>
      <View style={styles.line} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="E-mail"
          placeholderTextColor="#000"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.line} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Heslo"
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
          placeholder="Potvrďte heslo"
          placeholderTextColor="#000"
          secureTextEntry
        />
      </View>
      <View style={styles.line} />

      <View style={styles.termsContainer}>
        <Switch
          value={agreedToTerms}
          onValueChange={setAgreedToTerms}
          thumbColor={agreedToTerms ? '#2450FF' : '#2450FF'}
          trackColor={{ false: '#565656', true: '#07FBF2' }}
        />
        <Text style={styles.termsText}>
          Souhlasím s{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.nandezu.com/terms-and-conditions')}>
            podmínkami použití
          </Text>
        </Text>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Pokračovat</Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#CFD6DE',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  circleContainer: {
    position: 'absolute',
    top: -155,
    left: '50%',
    transform: [{ translateX: -140 }],
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
    marginTop: 125,
    color: '#000',
    fontSize: 30,
    fontWeight: '300',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
  },
  input: {
    color: '#000',
    fontSize: 15,
    height: 40,
    paddingLeft: 2,
  },
  line: {
    height: 1,
    backgroundColor: '#000',
    width: '80%',
    marginBottom: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  termsText: {
    color: '#000',
    marginLeft: 10,
  },
  link: {
    color: '#2450FF',
    textDecorationLine: 'underline',
  },
  continueButton: {
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  
  },
  
  message: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    width: '80%',
  },
});