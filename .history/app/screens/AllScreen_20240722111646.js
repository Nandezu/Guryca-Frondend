import React, { useState, useRef, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { useProfile } from '../../ProfileProvider';
import { getToken } from '@/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const AllScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profileImage, setProfileImage] = useState(null);
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
        }
      };

      if (userId) {
        loadData();
      } else {
        console.error('userId je nedefinované v useFocusEffect');
      }
    }, [userId, route.params?.deletedItemId, setProfiles])
  );

  useFocusEffect(
    useCallback(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: selectedProfileIndex,
          animated: true,
        });
      }
    }, [selectedProfileIndex])
  );

  const loadProfileImage = async () => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('Uživatel není autentizován');
      }

      const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`, {
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
      return null;
    }
  };

  const loadTryOnResults = async (profileImage) => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('Uživatel není autentizován');
      }
      const response = await axios.get(`http://192.168.0.106:8000/tryon/results/`, {
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

      return results;
    } catch (error) {
      console.error('Chyba při načítání výsledků try-on:', error);
      return [{ id: 'profile', imageUrl: profileImage || null }];
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setSelectedProfileIndex(index);
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
              userId: userId
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
                (isFromImageDetail || index > 0) && styles.transformedProfileImage, // Apply transformedProfileImage style to all images except the first one unless it is from ImageDetailScreen
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
              navigation.navigate(targetScreen, { userId });
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
          onScrollToIndexFailed={() => {}}
        />
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/alles.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'first',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.50, left: SCREEN_WIDTH * 0.060, zIndex: 2 },
        'UserScreen'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezud.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'treti',
        { position: 'absolute', top: SCREEN_HEIGHT * -0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'UserScreen'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/loved.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        'loves',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, left: SCREEN_WIDTH * 0.88, zIndex: 2 },
        'ManageProfilePictures'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/subsd.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        'subs',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
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
          {renderImageWithTouchableOpacity(
            require('../../assets/images/jeanns.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.370 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'sixth',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.026, left: SCREEN_WIDTH * -0.17 },
            'JeansScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/jumpsuit.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.337 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'seventh',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.027, left: SCREEN_WIDTH * -0.17 },
            'JumpsuitScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/shorts.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.370 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'eight',
            { marginRight: SCREEN_WIDTH * -0.29, marginTop: SCREEN_HEIGHT * 0.026, left: SCREEN_WIDTH * -0.17 },
            'ShortScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/jacket.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.324 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'night',
            { marginRight: SCREEN_WIDTH * -0.31, marginTop: SCREEN_HEIGHT * 0.038, left: SCREEN_WIDTH * -0.17 },
            'JacketScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/sweatpants.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.368 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'ten',
            { marginRight: SCREEN_WIDTH * -0.28, marginTop: SCREEN_HEIGHT * 0.026, left: SCREEN_WIDTH * -0.17 },
            'SweatpantsScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/skirts.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.368 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'eleven',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.028, left: SCREEN_WIDTH * -0.17 },
            'SkirtScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/sweater.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.336 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'twelve',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.028, left: SCREEN_WIDTH * -0.17 },
            'SweaterScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/pants.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.368 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'thirtheen',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.028, left: SCREEN_WIDTH * -0.17 },
            'PantsScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/leggins.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.368 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'fourtheen',
            { marginRight: SCREEN_WIDTH * -0.28, marginTop: SCREEN_HEIGHT * 0.028, left: SCREEN_WIDTH * -0.17 },
            'LeggingsScreen'
          )}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/coat.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.337 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
            'fifthteen',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.027, left: SCREEN_WIDTH * -0.17 },
            'CoatScreen'
          )}
          <View style={{ width: SCREEN_WIDTH * 0.2 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE',
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
