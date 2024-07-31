import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';  // Import Picker from @react-native-picker/picker
import { BASE_URL } from '@config';

const ChangeRegionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, token } = route.params || {};  // Přidána kontrola pro route.params

  const [shoppingRegion, setShoppingRegion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleChangeRegion = async () => {
    if (!shoppingRegion || !password || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setMessage('User not authenticated.');
        return;
      }

      const response = await axios.post(`${BASE_URL}/user/change_region/`,
        {
          newRegion: shoppingRegion, // Oprava zde
          password
        },
        {
          headers: { 'Authorization': `Token ${token}` }
        }
      );

      if (response.status === 200) {
        setMessage('Region changed successfully!');
        setTimeout(() => {
          setShoppingRegion('');
          setPassword('');
          setConfirmPassword('');
          setMessage('');
          navigation.navigate('ProfileSetScreen', { userId, token });
        }, 2000);
      } else {
        setMessage('Failed to change region. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setMessage('Error: ' + (error.response.data.detail || JSON.stringify(error.response.data)));
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('Failed to change region. Please try again.');
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
        <Text style={styles.title}>Change Region</Text>
        <View style={styles.regionPickerContainer}>
        
          <Picker
            selectedValue={shoppingRegion}
            style={styles.picker}
            onValueChange={(itemValue) => setShoppingRegion(itemValue)}
          >
            <Picker.Item label="Select Shopping Region" value="" />
              <Picker.Item label="Argentina" value="Argentina" />
              <Picker.Item label="Australia" value="Australia" />
              <Picker.Item label="Austria" value="Austria" />
              <Picker.Item label="Bangladesh" value="Bangladesh" />
              <Picker.Item label="Belgium" value="Belgium" />
              <Picker.Item label="Brazil" value="Brazil" />
              <Picker.Item label="Canada" value="Canada" />
              <Picker.Item label="Chile" value="Chile" />
              <Picker.Item label="China" value="China" />
              <Picker.Item label="Colombia" value="Colombia" />
              <Picker.Item label="Czech Republic" value="Czech Republic" />
              <Picker.Item label="Denmark" value="Denmark" />
              <Picker.Item label="Dominican Republic" value="Dominican Republic" />
              <Picker.Item label="Ecuador" value="Ecuador" />
              <Picker.Item label="Egypt" value="Egypt" />
              <Picker.Item label="Finland" value="Finland" />
              <Picker.Item label="France" value="France" />
              <Picker.Item label="Germany" value="Germany" />
              <Picker.Item label="Greece" value="Greece" />
              <Picker.Item label="Hong Kong" value="Hong Kong" />
              <Picker.Item label="Hungary" value="Hungary" />
              <Picker.Item label="India" value="India" />
              <Picker.Item label="Ireland" value="Ireland" />
              <Picker.Item label="Israel" value="Israel" />
              <Picker.Item label="Italy" value="Italy" />
              <Picker.Item label="Japan" value="Japan" />
              <Picker.Item label="Jordan" value="Jordan" />
              <Picker.Item label="Kenya" value="Kenya" />
              <Picker.Item label="Mexico" value="Mexico" />
              <Picker.Item label="Netherlands" value="Netherlands" />
              <Picker.Item label="New Zealand" value="New Zealand" />
              <Picker.Item label="Nigeria" value="Nigeria" />
              <Picker.Item label="Norway" value="Norway" />
              <Picker.Item label="Peru" value="Peru" />
              <Picker.Item label="Poland" value="Poland" />
              <Picker.Item label="Portugal" value="Portugal" />
              <Picker.Item label="Qatar" value="Qatar" />
              <Picker.Item label="Russia" value="Russia" />
              <Picker.Item label="Saudi Arabia" value="Saudi Arabia" />
              <Picker.Item label="Singapore" value="Singapore" />
              <Picker.Item label="Slovakia" value="Slovakia" />
              <Picker.Item label="Slovenia" value="Slovenia" />
              <Picker.Item label="South Africa" value="South Africa" />
              <Picker.Item label="South Korea" value="South Korea" />
              <Picker.Item label="Spain" value="Spain" />
              <Picker.Item label="Sweden" value="Sweden" />
              <Picker.Item label="Switzerland" value="Switzerland" />
              <Picker.Item label="Taiwan" value="Taiwan" />
              <Picker.Item label="Thailand" value="Thailand" />
              <Picker.Item label="Turkey" value="Turkey" />
              <Picker.Item label="Uganda" value="Uganda" />
              <Picker.Item label="Ukraine" value="Ukraine" />
              <Picker.Item label="United Arab Emirates" value="United Arab Emirates" />
              <Picker.Item label="United Kingdom" value="United Kingdom" />
              <Picker.Item label="United States" value="United States" />
              <Picker.Item label="Vietnam" value="Vietnam" />
              <Picker.Item label="Bulgaria" value="Bulgaria" />
            </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#fff"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <TouchableOpacity style={styles.smallButton} onPress={handleChangeRegion}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE',
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
    top: 180,
    left: '50%',
    color: '#000',
    fontSize: 30,
    fontWeight: '300',
    transform: [{ translateX: -42 }],
  },
  subtitle: {
    position: 'absolute',
    top: 245,
    left: '50%',
    color: '#000',
    fontSize: 16,
    transform: [{ translateX: -120 }],
  },
  formContainer: {
    marginTop: 250, // Adjust this value as needed to move the form down
  },
  title: {
    color: '#000',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  regionPickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    color: '#000',
    fontSize: 18,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
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
    padding: 10, // Celkový padding
    paddingVertical: 10, // Snížení svislého paddingu
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30, // Větší mezera nad tlačítkem
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ChangeRegionScreen;
