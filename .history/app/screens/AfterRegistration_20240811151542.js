import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@config';

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
      setMessage('Prosím vyberte nákupní region a pohlaví.');
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
        const { user_id, token } = response.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', user_id.toString());
        navigation.navigate('UploadPhoto', { userId: user_id });
      }
    } catch (error) {
      setMessage('Registrace selhala. Prosím zkuste to znovu.');
      console.error('Chyba registrace:', error);
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
      <Text style={styles.subtitle}>Dokončete svůj profil</Text>

      <View style={styles.contentContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Nákupní region</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={shoppingRegion}
              style={styles.picker}
              onValueChange={(itemValue) => setShoppingRegion(itemValue)}
            >
              <Picker.Item label="Vyberte nákupní region" value="" />
              <Picker.Item label="Argentina" value="Argentina" />
              <Picker.Item label="Austrálie" value="Australia" />
              <Picker.Item label="Rakousko" value="Austria" />
              <Picker.Item label="Bangladéš" value="Bangladesh" />
              <Picker.Item label="Belgie" value="Belgium" />
              <Picker.Item label="Brazílie" value="Brazil" />
              <Picker.Item label="Kanada" value="Canada" />
              <Picker.Item label="Chile" value="Chile" />
              <Picker.Item label="Čína" value="China" />
              <Picker.Item label="Kolumbie" value="Colombia" />
              <Picker.Item label="Česká republika" value="Czech Republic" />
              <Picker.Item label="Dánsko" value="Denmark" />
              <Picker.Item label="Dominikánská republika" value="Dominican Republic" />
              <Picker.Item label="Ekvádor" value="Ecuador" />
              <Picker.Item label="Egypt" value="Egypt" />
              <Picker.Item label="Finsko" value="Finland" />
              <Picker.Item label="Francie" value="France" />
              <Picker.Item label="Německo" value="Germany" />
              <Picker.Item label="Řecko" value="Greece" />
              <Picker.Item label="Hong Kong" value="Hong Kong" />
              <Picker.Item label="Maďarsko" value="Hungary" />
              <Picker.Item label="Indie" value="India" />
              <Picker.Item label="Irsko" value="Ireland" />
              <Picker.Item label="Izrael" value="Israel" />
              <Picker.Item label="Itálie" value="Italy" />
              <Picker.Item label="Japonsko" value="Japan" />
              <Picker.Item label="Jordánsko" value="Jordan" />
              <Picker.Item label="Keňa" value="Kenya" />
              <Picker.Item label="Mexiko" value="Mexico" />
              <Picker.Item label="Nizozemsko" value="Netherlands" />
              <Picker.Item label="Nový Zéland" value="New Zealand" />
              <Picker.Item label="Nigérie" value="Nigeria" />
              <Picker.Item label="Norsko" value="Norway" />
              <Picker.Item label="Peru" value="Peru" />
              <Picker.Item label="Polsko" value="Poland" />
              <Picker.Item label="Portugalsko" value="Portugal" />
              <Picker.Item label="Katar" value="Qatar" />
              <Picker.Item label="Rusko" value="Russia" />
              <Picker.Item label="Saúdská Arábie" value="Saudi Arabia" />
              <Picker.Item label="Singapur" value="Singapore" />
              <Picker.Item label="Slovensko" value="Slovakia" />
              <Picker.Item label="Slovinsko" value="Slovenia" />
              <Picker.Item label="Jižní Afrika" value="South Africa" />
              <Picker.Item label="Jižní Korea" value="South Korea" />
              <Picker.Item label="Španělsko" value="Spain" />
              <Picker.Item label="Švédsko" value="Sweden" />
              <Picker.Item label="Švýcarsko" value="Switzerland" />
              <Picker.Item label="Tchaj-wan" value="Taiwan" />
              <Picker.Item label="Thajsko" value="Thailand" />
              <Picker.Item label="Turecko" value="Turkey" />
              <Picker.Item label="Uganda" value="Uganda" />
              <Picker.Item label="Ukrajina" value="Ukraine" />
              <Picker.Item label="Spojené arabské emiráty" value="United Arab Emirates" />
              <Picker.Item label="Spojené království" value="United Kingdom" />
              <Picker.Item label="Spojené státy" value="United States" />
              <Picker.Item label="Vietnam" value="Vietnam" />
              <Picker.Item label="Bulharsko" value="Bulgaria" />
            </Picker>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Pohlaví</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Vyberte pohlaví" value="" />
              <Picker.Item label="Žena" value="female" />
              <Picker.Item label="Muž" value="male" />
              <Picker.Item label="Jiné" value="other" />
            </Picker>
          </View>
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Potvrdit</Text>
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