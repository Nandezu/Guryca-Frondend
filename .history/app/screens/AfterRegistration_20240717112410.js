import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function AfterRegistration() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [username, setUsername] = useState('');
  const [shoppingRegion, setShoppingRegion] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
        const { username, gender, shopping_region } = response.data;
        setUsername(username);
        setGender(gender);
        setShoppingRegion(shopping_region);
      } catch (error) {
        setMessage('Failed to load user data. Please try again.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async () => {
    if (!shoppingRegion || !gender) {
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.patch(`http://192.168.0.106:8000/user/users/${userId}/`, {
        shopping_region: shoppingRegion,
        gender,
      });

      if (response.status === 200) {
        setMessage('Information updated successfully!');
        navigation.navigate('UploadPhoto', { userId });
      } else {
        setMessage('Failed to update information. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setMessage('Failed to update information: ' + (error.response.data.detail || JSON.stringify(error.response.data)));
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('Failed to update information. Please try again.');
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
      <Text style={styles.subtitle}>Your First AI-Powered Fashion Assistant</Text>
      <Text style={styles.successText}>Hello, {username}</Text>

      <View style={styles.regionPickerContainer}>
        <Text style={styles.pickerLabel}>Shopping Region</Text>
        <Picker
          selectedValue={shoppingRegion}
          style={styles.picker}
          onValueChange={(itemValue) => setShoppingRegion(itemValue)}
        >
          <Picker.Item label="Select Region" value="" />
          <Picker.Item label="United States" value="usa" />
          <Picker.Item label="United Kingdom" value="uk" />
          <Picker.Item label="Germany" value="germany" />
          <Picker.Item label="Brazil" value="brazil" />
          <Picker.Item label="Italy" value="italy" />
          <Picker.Item label="France" value="france" />
          <Picker.Item label="Spain" value="spain" />
          <Picker.Item label="Poland" value="poland" />
          <Picker.Item label="Czech Republic" value="czech" />
          <Picker.Item label="Slovakia" value="slovakia" />
        </Picker>
      </View>
      

      <View style={styles.genderPickerContainer}>
        <Text style={styles.pickerLabel}>Gender</Text>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Select Gender" value="" />
          
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>
      

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity style={styles.completeButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#160029',
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
  subtitle: {
    position: 'absolute',
    top: 250,
    left: '50%',
    color: '#fff',
    fontSize: 16,
    transform: [{ translateX: -140 }],
  },
  successText: {
    position: 'absolute',
    top: 300,
    left: '50%',
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
    transform: [{ translateX: -60 }],
  },
  regionPickerContainer: {
    position: 'absolute',
    top: 380, // Adjust this value to move the picker up or down
    left: '50%',
    width: '80%',
    transform: [{ translateX: -145 }], // Adjust this value to move the picker left or right
  },
  genderPickerContainer: {
    position: 'absolute',
    top: 490, // Adjust this value to move the picker up or down
    left: '50%',
    width: '80%',
    transform: [{ translateX: -145 }], // Adjust this value to move the picker left or right
  },
  pickerLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    color: '#fff',
    backgroundColor: '#333',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
 
  },
  completeButton: {
    position: 'absolute',
    top: 650,
    left: '50%',
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -92 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  message: {
    position: 'absolute',
    top: 600,
    left: '50%',
    transform: [{ translateX: -145 }],
    color: '#fff',
    fontSize: 14,
    width: '80%',
    textAlign: 'center',
  },
});
