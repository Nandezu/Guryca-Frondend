import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { useProfile } from '../../ProfileProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const AllScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const { isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const { profiles, setProfiles, selectedProfileIndex, setSelectedProfileIndex } = useProfile();
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
        const profileImage = response.data.profile_images?.[0] || null;
        const tryOnResults = await loadTryOnResults(profileImage);
        setProfiles(tryOnResults);
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchProfileImage();
    }
  }, [userId]);

  const loadTryOnResults = async (profileImage) => {
    try {
      const response = await axios.get(`http://192.168.0.106:8000/tryon/results/`);
      const results = [
        { id: 'profile', imageUrl: profileImage },
        ...response.data.map(item => ({ id: item.id, imageUrl: item.result_image })),
      ];
      return results;
    } catch (error) {
      console.error('Error loading try-on results:', error);
      return [{ id: 'profile', imageUrl: profileImage || null }];
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setSelectedProfileIndex(index);
  };

  const renderProfileItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        if (index !== 0 && item.id !== 'profile') {
          setSelectedProfileIndex(index);
          navigation.navigate('ImageDetailScreen', {
            imageUrl: item.imageUrl,
            profileIndex: index,
            itemId: item.id,
            userId: userId,
          });
        }
      }}
      disabled={index === 0 || item.id === 'profile'}
    >
      <View style={styles.profileItemContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={[styles.profileImage, index > 0 && styles.transformedProfileImage]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: 'gray' }]} />
        )}
      </View>
    </TouchableOpacity>
  );

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
            if (pressed[pressedKey]) {
              navigation.navigate(targetScreen, { userId });
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {profiles.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={profiles}
          renderItem={renderProfileItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.profileScrollContainer}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          initialScrollIndex={selectedProfileIndex}
        />
      )}

      <Image
        source={isDarkMode ? require('../../assets/images/square2.png') : require('../../assets/images/square.png')}
        style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.40, position: 'absolute', top: SCREEN_HEIGHT * 0.14, left: SCREEN_WIDTH * 0.12, zIndex: 1 }}
        resizeMode="contain"
      />

      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: 'absolute',
          top: TOGGLE_ICON_TOP,
          right: TOGGLE_ICON_RIGHT,
          zIndex: 3
        }}
      >
        <Image
          source={isDarkMode ? require('../../assets/images/dark.png') : require('../../assets/images/sun.png')}
          style={{
            width: TOGGLE_ICON_SIZE,
            height: TOGGLE_ICON_SIZE
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {renderImageWithTouchableOpacity(
        require('../../assets/images/alles.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'first',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.49, left: SCREEN_WIDTH * 0.060, zIndex: 1 },
        'UserScreen'
      )}

      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContentContainer}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {renderImageWithTouchableOpacity(
            require('../../assets/images/dresso.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.35 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'fourth',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.0095, left: SCREEN_WIDTH * -0.17 },
            'DressScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/topps.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.345 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'fifth',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.015, left: SCREEN_WIDTH * -0.17 },
            'TopScreen'
          )}
          {/* Additional image renderings */}
          <View style={{ width: SCREEN_WIDTH * 0.2 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04011A',
  },
  scrollContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.03,
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
    backgroundColor: 'transparent',
  },
  profileScrollContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12,
    left: SCREEN_WIDTH * 0.010,
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
    zIndex: 2,
  },
  profileItemContainer: {
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
  },
  transformedProfileImage: {
    transform: [{ scaleX: 0.87 }],
  },
});

export default AllScreen;
