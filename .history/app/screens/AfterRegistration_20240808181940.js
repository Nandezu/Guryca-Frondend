import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BASE_URL } from '@config';

const { height } = Dimensions.get('window');

export default function AfterRegistration() {
  const route = useRoute();
  const navigation = useNavigation();
  const { nickname, email, password } = route.params;
  const [shoppingRegion, setShoppingRegion] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    if (!shoppingRegion || !gender) {
      setMessage('Please select both shopping region and gender.');
      return;
    }

    // Okamžitě přesměrujeme na CodeConfirmScreen
    navigation.navigate('CodeConfirmScreen', { 
      email,
      additionalInfo: {
        username: nickname,
        password,
        shopping_region: shoppingRegion,
        gender
      }
    });

    // Spustíme pre-registraci na pozadí
    axios.post(`${BASE_URL}/user/pre-register/`, {
      username: nickname,
      email,
      password,
      shopping_region: shoppingRegion,
      gender
    }).catch(error => {
      console.error('Pre-registration error:', error);
      // Zde můžete implementovat nějakou logiku pro zpracování chyby,
      // například zobrazení upozornění uživateli při příštím spuštění aplikace
    });
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
    marginTop: 190,
    color: '#000',
    fontSize: 30,
    fontWeight: '300',
  },
  subtitle: {
    position: 'absolute',
    marginTop: 270,
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
    paddingBottom: 140,
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
    position: 'absolute',
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    top: 640,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
  message: {
    color: 'black',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    width: '80%',
  },
});