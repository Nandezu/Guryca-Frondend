import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ImageDetailScreen = () => {
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

      const fileUri = `${FileSystem.documentDirectory}image.jpg`;
      await FileSystem.downloadAsync(imageUrl, fileUri);
      await MediaLibrary.saveToLibraryAsync(fileUri);
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

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />

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
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.6,
    borderRadius: 20,
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
});

export default ImageDetailScreen;