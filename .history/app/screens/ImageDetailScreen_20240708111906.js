import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 1;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 2.6;

const ImageDetailScreen = () => {
  const [pressed, setPressed] = useState({ nandezu: false, love: false, subs: false });
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUrl, onDelete } = route.params;

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save the image.');
        return;
      }

      const fileExtension = imageUrl.split('.').pop();
      const fileName = `download.${fileExtension}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (downloadResult.status !== 200) {
        Alert.alert('Error', 'Failed to download image');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Downloads", asset, false);
      
      Alert.alert('Success', 'Image saved to gallery');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          onDelete();
          navigation.goBack();
        }}
      ]
    );
  };

  const renderImageWithTouchableOpacity = (imageSource, imageStyle, touchableStyle, pressedKey, containerStyle, targetScreen) => {
    let pressTimer;

    return (
      <View style={[styles.imageWrapper, containerStyle]}>
        <Image
          source={imageSource}
          style={[styles.image, imageStyle, pressed[pressedKey] && styles.pressedImage]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, touchableStyle]}
          onPressIn={() => {
            pressTimer = setTimeout(() => setPressed({ ...pressed, [pressedKey]: true }), 70);
          }}
          onPressOut={() => {
            clearTimeout(pressTimer);
            setPressed({ ...pressed, [pressedKey]: false });
          }}
          onPress={() => {
            if (pressed[pressedKey] && targetScreen) {
              navigation.navigate(targetScreen);
            }
          }}
        />
      </View>
    );
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
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    transform: [{ scaleX: 0.87 }], // Aplikujeme transformaci přímo zde
  },
  nandezuContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.05,
    right: SCREEN_WIDTH * 0.05,
  },
  nandezuImage: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.07,
  },
  nandezuButton: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.07,
  },
  loveContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.05,
    left: SCREEN_WIDTH * 0.05,
  },
  loveImage: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_HEIGHT * 0.035,
  },
  loveButton: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_HEIGHT * 0.035,
  },
  subsContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    left: SCREEN_WIDTH * 0.05,
  },
  subsImage: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.04,
  },
  subsButton: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.04,
  },
  downloadButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.05,
    right: SCREEN_WIDTH * 0.1,
  },
  deleteButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.05,
    left: SCREEN_WIDTH * 0.1,
  },
  buttonImage: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    // Základní styl pro obrázky
  },
  pressedImage: {
    opacity: 0.5,
  },
  button: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

export default ImageDetailScreen;