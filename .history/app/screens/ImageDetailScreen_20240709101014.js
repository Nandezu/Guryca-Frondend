import React, { useState, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import { getToken } from '@/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.7;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.9;

const ImageDetailScreen = () => {
  const [pressed, setPressed] = useState({ nandezu: false, love: false, subs: false });
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUrl, itemId } = route.params;

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={handleDelete}>
            <Image source={require('../../assets/images/delete.png')} style={styles.headerButtonImage} />
          </TouchableOpacity>
        )
      });
    }, [navigation, handleDelete])
  );

  const handleDownload = async () => {
    // ... (zůstává beze změny)
  };

  const handleDelete = useCallback(async () => {
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

              // Smazání obrázku z S3 a databáze
              await axios.delete(`http://192.168.0.106:8000/tryon/delete-result/${itemId}/`, {
                headers: {
                  'Authorization': `Token ${userToken}`
                }
              });

              // Návrat na DressScreen s informací o smazaném obrázku
              navigation.navigate('DressScreen', { deletedItemId: itemId });
            } catch (error) {
              console.error('Chyba při mazání obrázku:', error);
              Alert.alert('Chyba', 'Nepodařilo se smazat obrázek');
            }
          }
        }
      ]
    );
  }, [itemId, navigation]);

  const renderImageWithTouchableOpacity = (imageSource, imageStyle, touchableStyle, pressedKey, containerStyle, targetScreen) => {
    // ... (zůstává beze změny)
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.mainImageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezu.png'),
        styles.nandezuImage,
        styles.nandezuButton,
        'nandezu',
        styles.nandezuContainer,
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/love.png'),
        styles.loveImage,
        styles.loveButton,
        'love',
        styles.loveContainer
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subs.png'),
        styles.subsImage,
        styles.subsButton,
        'subs',
        styles.subsContainer
      )}

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Image source={require('../../assets/images/download.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Image source={require('../../assets/images/delete.png')} style={styles.buttonImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (ostatní styly zůstávají beze změny)
  headerButtonImage: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    marginRight: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.05,
    left: SCREEN_WIDTH * 0.1,
  },
  // ... (ostatní styly zůstávají beze změny)
});

export default ImageDetailScreen;