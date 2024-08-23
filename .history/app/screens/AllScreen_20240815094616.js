import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList, Alert, Text } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { useProfile } from '../../ProfileProvider';
import { getToken } from '@/auth';
import { BASE_URL } from '@config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const scale = Math.min(SCREEN_WIDTH / 375, SCREEN_HEIGHT / 812);
const scaledSize = (size) => Math.round(size * scale);

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const MAX_TRY_ON_RESULTS = 100;

const AllScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const flatListRef = useRef(null);

  const { profiles, setProfiles, selectedProfileIndex, setSelectedProfileIndex } = useProfile();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          if (!userId) {
            console.error('userId je nedefinované v loadData');
            setError('Uživatel není autentizován');
            return;
          }

          console.log('Začíná loadData pro userId:', userId);
          const profileImage = await loadProfileImage();
          const tryOnResults = await loadTryOnResults(profileImage);

          if (route.params?.deletedItemId) {
            const updatedResults = tryOnResults.filter(item => item.id !== route.params.deletedItemId);
            setProfiles(updatedResults);
            navigation.setParams({ deletedItemId: undefined });
          } else {
            setProfiles(tryOnResults);
          }
        } catch (error) {
          console.error("Chyba v loadData:", error);
          setError('Chyba při načítání dat');
        }
      };

      if (userId) {
        loadData();
      } else {
        console.error('userId je nedefinované v useFocusEffect');
        setError('Uživatel není autentizován');
      }
    }, [userId, route.params?.deletedItemId, setProfiles])
  );

  useEffect(() => {
    if (route.params?.selectedProfileIndex !== undefined) {
      setSelectedProfileIndex(route.params.selectedProfileIndex);
      flatListRef.current?.scrollToIndex({ 
        index: route.params.selectedProfileIndex, 
        animated: false,
        viewPosition: 0.5
      });
    }
  }, [route.params?.selectedProfileIndex]);

  const loadProfileImage = async () => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('Uživatel není autentizován');
      }

      const response = await axios.get(`${BASE_URL}/user/users/${userId}/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });
      const profileImages = response.data.profile_images;
      const activeImageUrl = profileImages && profileImages.length > 0 ? profileImages[0] : null;
      console.log("Načtena URL aktivního profilového obrázku:", activeImageUrl);
      setProfileImage(activeImageUrl);
      return activeImageUrl;
    } catch (error) {
      console.error('Chyba při načítání profilového obrázku:', error);
      setError('Nepodařilo se načíst profilový obrázek.');
      return null;
    }
  };

  const loadTryOnResults = async (profileImage) => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('Uživatel není autentizován');
      }
      const response = await axios.get(`${BASE_URL}/tryon/results/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });

      console.log('Výsledky try-on:', response.data);

      const results = [
        { id: 'profile', imageUrl: profileImage },
        ...response.data.map(item => ({ id: item.id, imageUrl: item.result_image }))
      ];

      console.log('Zpracované výsledky try-on:', results);

      if (results.length > MAX_TRY_ON_RESULTS) {
        Alert.alert(
          'Try-On Limit Reached',
          'You have reached the maximum number of try-ons. Each new try-on will delete the oldest result. Please back up any important results.'
        );
      }

      return results;
    } catch (error) {
      console.error('Chyba při načítání výsledků try-on:', error);
      setError('Nepodařilo se načíst výsledky try-on.');
      return [{ id: 'profile', imageUrl: profileImage || null }];
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    if (index !== selectedProfileIndex) {
      setSelectedProfileIndex(index);
      navigation.setParams({ selectedProfileIndex: index });
    }
  };

  const renderProfileItem = ({ item, index }) => {
    const isFromImageDetail = item.imageUrl.includes('from_image_detail=true');
    return (
      <TouchableOpacity
        onPress={() => {
          if (index !== 0 && item.id !== 'profile') {
            setSelectedProfileIndex(index);
            navigation.navigate('ImageDetailScreen', {
              imageUrl: item.imageUrl,
              profileIndex: index,
              itemId: item.id,
              userId: userId,
              lastViewedIndex: index
            });
          }
        }}
        disabled={index === 0 || item.id === 'profile'}
        delayPressIn={100}
        delayPressOut={100}
        delayLongPress={200}
      >
        <View style={styles.profileItemContainer}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={[
                styles.profileImage,
                (index > 0 || isFromImageDetail) && styles.transformedProfileImage,
              ]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: 'gray' }]} />
          )}
        </View>
      </TouchableOpacity>
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
            if (pressed[pressedKey]) {
              navigation.navigate(targetScreen, { 
                userId, 
                selectedProfileIndex, 
                profiles 
              });
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {profileImage && (
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
          removeClippedSubviews={true}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          decelerationRate="fast"
          snapToAlignment="center"
          snapToInterval={SCREEN_WIDTH}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          onViewableItemsChanged={({ viewableItems }) => {
            if (viewableItems.length > 0) {
              const newIndex = viewableItems[0].index;
              setSelectedProfileIndex(newIndex);
            }
          }}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false, viewPosition: 0.5 });
            });
          }}
        />
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/alles.png'),
        { width: scaledSize(SCREEN_WIDTH * 0.6), height: scaledSize(SCREEN_HEIGHT * 0.2) },
        { width: scaledSize(SCREEN_WIDTH * 0.6), height: scaledSize(SCREEN_HEIGHT * 0.2), top: scaledSize(SCREEN_HEIGHT * 0.025), left: scaledSize(SCREEN_WIDTH * 0.1) },
        'first',
        { position: 'absolute', top: scaledSize(SCREEN_HEIGHT * 0.46), left: scaledSize(SCREEN_WIDTH * 0.060), zIndex: 2 },
        'UserScreen'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezud.png'),
        { width: scaledSize(SCREEN_WIDTH * 0.35), height: scaledSize(SCREEN_HEIGHT * 0.16) },
        { width: scaledSize(SCREEN_WIDTH * 0.35), height: scaledSize(SCREEN_HEIGHT * 0.16), top: scaledSize(SCREEN_HEIGHT * 0.025), left: scaledSize(SCREEN_WIDTH * 0.1) },
        'treti',
        { position: 'absolute', top: scaledSize(SCREEN_HEIGHT * -0.05), left: scaledSize(SCREEN_WIDTH * 0.330), zIndex: 2 },
        'UserScreen'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/loved.png'),
        { width: scaledSize(SCREEN_WIDTH * 0.07), height: scaledSize(SCREEN_HEIGHT * 0.035) },
        { width: scaledSize(SCREEN_WIDTH * 0.07), height: scaledSize(SCREEN_HEIGHT * 0.035) },
        'loves',
        { position: 'absolute', top: scaledSize(SCREEN_HEIGHT * 0.010), left: scaledSize(SCREEN_WIDTH * 0.88), zIndex: 2 },
        'ManageProfilePictures'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/subsd.png'),
        { width: scaledSize(SCREEN_WIDTH * 0.08), height: scaledSize(SCREEN_HEIGHT * 0.04) },
        { width: scaledSize(SCREEN_WIDTH * 0.08), height: scaledSize(SCREEN_HEIGHT * 0.04) },
        'subs',
        { position: 'absolute', top: scaledSize(SCREEN_HEIGHT * 0.0105), left: scaledSize(SCREEN_WIDTH * 0.050), zIndex: 2 },
        'ProfileSetScreen'
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
            { width: scaledSize(SCREEN_WIDTH * 0.75), height: scaledSize(SCREEN_HEIGHT * 0.35) },
            { width: scaledSize(SCREEN_WIDTH * 0.35), height: scaledSize(SCREEN_HEIGHT * 0.250), top: scaledSize(SCREEN_HEIGHT * 0.070), left: scaledSize(SCREEN_WIDTH * 0.180) },
            'fourth',
            { marginRight: scaledSize(SCREEN_WIDTH * -0.30), marginTop: scaledSize(SCREEN_HEIGHT * 0.0095), left: scaledSize(SCREEN_WIDTH * -0.17) },
            'DressScreen'
          )}

          {renderImageWithTouchableOpacity(
            require('../../assets/images/topps.png'),
            { width: scaledSize(SCREEN_WIDTH * 0.75), height: scaledSize(SCREEN_HEIGHT * 0.345) },
            { width: scaledSize(SCREEN_WIDTH * 0.35), height: scaledSize(SCREEN_HEIGHT * 0.250), top: scaledSize(SCREEN_HEIGHT * 0.070), left: scaledSize(SCREEN_WIDTH * 0.180) },
            'fifth',
            { marginRight: scaledSize(SCREEN_WIDTH * -0.30), marginTop: scaledSize(SCREEN_HEIGHT * 0.015), left: scaledSize(SCREEN_WIDTH * -0.17) },
            'TopScreen'
          )}
          {/* ... (rest of the renderImageWithTouchableOpacity calls remain the same, but with scaledSize applied) */}
          <View style={{ width: scaledSize(SCREEN_WIDTH * 0.2) }} />
        </ScrollView>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE',
  },
  scrollContentContainer: {
    paddingHorizontal: scaledSize(SCREEN_WIDTH * 0.05),
    paddingVertical: scaledSize(SCREEN_HEIGHT * 0.03),
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
    top: scaledSize(SCREEN_HEIGHT * 0.080),
    left: scaledSize(SCREEN_WIDTH * 0.010),
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
    borderRadius: scaledSize(20),
  },
  transformedProfileImage: {
    transform: [{ scaleX: 0.87 }],
  },
  errorContainer: {
    position: 'absolute',
    bottom: scaledSize(20),
    left: scaledSize(20),
    right: scaledSize(20),
    padding: scaledSize(10),
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: scaledSize(5),
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: scaledSize(14),
  },
});

export default AllScreen;