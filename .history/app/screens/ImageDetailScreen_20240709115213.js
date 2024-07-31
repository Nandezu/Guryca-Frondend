import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import { getToken } from '@/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.7;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.9;

const ImageDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUrl, itemId } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Potřebné povolení', 'Prosím, udělte povolení pro uložení obrázku.');
        return;
      }

      const fileExtension = imageUrl.split('.').pop();
      const fileName = `download.${fileExtension}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (downloadResult.status !== 200) {
        Alert.alert('Chyba', 'Nepodařilo se stáhnout obrázek');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Downloads", asset, false);
      
      Alert.alert('Úspěch', 'Obrázek byl uložen do galerie');
    } catch (error) {
      console.error(error);
      Alert.alert('Chyba', 'Nepodařilo se uložit obrázek');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Smazat obrázek',
      'Opravdu chcete smazat tento obrázek?',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat',
          onPress: async () => {
            try {
              const userToken = await getToken();
              if (!userToken) {
                throw new Error('Uživatel není autentizován');
              }
  
              const response = await axios.delete(`http://192.168.0.106:8000/tryon/delete-result/${itemId}/`, {
                headers: {
                  'Authorization': `Token ${userToken}`
                }
              });
  
              if (response.status === 204) {
                Alert.alert('Úspěch', 'Obrázek byl úspěšně smazán');
                navigation.navigate('DressScreen', { deletedItemId: itemId, refresh: true });
              } else {
                throw new Error('Neočekávaná odpověď ze serveru');
              }
            } catch (error) {
              console.error('Chyba při mazání obrázku:', error);
              if (error.response) {
                console.error('Odpověď serveru:', error.response.data);
              }
              Alert.alert('Chyba', 'Nepodařilo se smazat obrázek. Zkuste to prosím znovu.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.mainImageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDownload}>
          <Image source={require('../../assets/images/download.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Image source={require('../../assets/images/delete.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    transform: [{ scaleX: 0.87 }],
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.05,
  },
  button: {
    padding: 10,
  },
  buttonImage: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
  },
});

export default ImageDetailScreen;