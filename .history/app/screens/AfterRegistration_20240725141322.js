import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const BASE_URL = 'http://192.168.0.106:8000';
const { height } = Dimensions.get('window');

export default function AfterRegistration() {
  const route = useRoute();
  const navigation = useNavigation();
  const { nickname, email, password } = route.params;
  const [shoppingRegion, setShoppingRegion] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirm = async () => {
    if (!shoppingRegion || !gender) {
      setMessage('Please select both shopping region and gender.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/user/register/`, {
        username: nickname,
        email,
        password,
        shopping_region: shoppingRegion,
        gender
      });

      if (response.status === 201) {
        setMessage('Registration successful! Please check your email for confirmation code.');
        setTimeout(() => {
          navigation.navigate('CodeConfirmScreen', { email: email });
        }, 3000);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setMessage('Registration failed: ' + JSON.stringify(error.response.data));
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('Registration failed. Please try again.');
      }
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
      <Text style={styles.subtitle}>Complete Your Profile</Text>

      <View style={styles.contentContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Shopping Region</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={shoppingRegion}
              style={styles.picker}
              onValueChange={(itemValue) => setShoppingRegion(itemValue)}
            >
              <Picker.Item label="Select Shopping Region" value="" />
              <Picker.Item label="United States" value="usa" />
              <Picker.Item label="United Kingdom" value="uk" />
              <Picker.Item label="Germany" value="germany" />
              <Picker.Item label="France" value="france" />
              <Picker.Item label="Italy" value="italy" />
              <Picker.Item label="Spain" value="spain" />
              <Picker.Item label="Netherlands" value="netherlands" />
              <Picker.Item label="Poland" value="poland" />
              <Picker.Item label="Sweden" value="sweden" />
              <Picker.Item label="Belgium" value="belgium" />
            </Picker>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Gender</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'absolute',
    top: -130,
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
    position: 'absolute',
    marginTop: 150,
    color: '#000',
    fontSize: 30,
    fontWeight: '300',
  },
  subtitle: {
    position: 'absolute',
    marginTop: 170,
    marginBottom: 30,
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 50,
  },
  pickerContainer: {
    width: '80%',
    marginBottom: 20,
  },
  pickerLabel: {
    color: '#000',
    fontSize: 16,
    marginBottom: 5,
  },
  pickerWrapper: {
    backgroundColor: '#808080',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: 50,
  },
  confirmButton: {
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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