import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList, Alert, Text } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { useProfile } from '../../ProfileProvider';
import { getToken } from '@/auth';
import { BASE_URL } from '@config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const getResponsiveDimension = (baseDimension, screenDimension) => {
  const calculated = (baseDimension / 100) * screenDimension;
  return isNaN(calculated) || !isFinite(calculated) ? 0 : calculated;
};

const safeResponsiveDimension = (value, screenDimension) => {
  if (typeof value === 'number') {
    return getResponsiveDimension(value, screenDimension);
  }
  return value;
};

const CONTAINER_WIDTH = getResponsiveDimension(55, SCREEN_WIDTH);
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const TOGGLE_ICON_TOP = getResponsiveDimension(15.5, SCREEN_HEIGHT);
const TOGGLE_ICON_RIGHT = getResponsiveDimension(23, SCREEN_WIDTH);
const TOGGLE_ICON_SIZE = getResponsiveDimension(6, SCREEN_WIDTH);

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

    const responsiveImageStyle = {
      width: safeResponsiveDimension(imageStyle.width, SCREEN_WIDTH),
      height: safeResponsiveDimension(imageStyle.height, SCREEN_HEIGHT),
    };

    const responsiveTouchableStyle = {
      width: safeResponsiveDimension(touchableStyle.width, SCREEN_WIDTH),
      height: safeResponsiveDimension(touchableStyle.height, SCREEN_HEIGHT),
      top: safeResponsiveDimension(touchableStyle.top, SCREEN_HEIGHT),
      left: safeResponsiveDimension(touchableStyle.left, SCREEN_WIDTH),
    };

    const responsiveContainerStyle = {
      ...containerStyle,
      top: containerStyle.top !== undefined ? safeResponsiveDimension(containerStyle.top, SCREEN_HEIGHT) : undefined,
      left: containerStyle.left !== undefined ? safeResponsiveDimension(containerStyle.left, SCREEN_WIDTH) : undefined,
      marginTop: containerStyle.marginTop !== undefined ? safeResponsiveDimension(containerStyle.marginTop, SCREEN_HEIGHT) : undefined,
      marginRight: containerStyle.marginRight !== undefined ? safeResponsiveDimension(containerStyle.marginRight, SCREEN_WIDTH) : undefined,
    };

    return (
      <View style={[styles.imageWrapper, responsiveContainerStyle]}>
        <Image
          source={imageSource}
          style={[styles.image, responsiveImageStyle, pressed[pressedKey] && styles.pressedImage]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, responsiveTouchableStyle]}
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
        { width: 60, height: 20 },
        { width: 60, height: 20, top: 2.5, left: 10 },
        'first',
        { position: 'absolute', top: 46, left: 6, zIndex: 2 },
        'UserScreen'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezud.png'),
        { width: 35, height: 16 },
        { width: 35, height: 16, top: 2.5, left: 10 },
        'treti',
        { position: 'absolute', top: -5, left: 33, zIndex: 2 },
        'UserScreen'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/loved.png'),
        { width: 7, height: 3.5 },
        { width: 7, height: 3.5 },
        'loves',
        { position: 'absolute', top: 1, left: 88, zIndex: 2 },
        'ManageProfilePictures'
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/subsd.png'),
        { width: 8, height: 4 },
        { width: 8, height: 4 },
        'subs',
        { position: 'absolute', top: 1.05, left: 5, zIndex: 2 },
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
            { width: 75, height: 35 },
            { width: 35, height: 25, top: 7, left: 18 },
            'fourth',
            { marginRight: -30, marginTop: 0.95, left: -17 },
            'DressScreen'
          )}

          {renderImageWithTouchableOpacity(
            require('../../assets/images/topps.png'),
            { width: 75, height: 34.5 },
            { width: 35, height: 25, top: 7, left: 18 },
            'fifth',
            { marginRight: -30, marginTop: 1.5, left: -17 },
            'TopScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/jeanns.png'),
            { width: 75, height: 37 },
            { width: 35, height: 25, top: 7, left: 18 },
            'sixth',
            { marginRight: -30, marginTop: 2.6, left: -17 },
            'JeansScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/jumpsuit.png'),
            { width: 75, height: 33.7 },
            { width: 35, height: 25, top: 7, left: 18 },
            'seventh',
            { marginRight: -30, marginTop: 2.7, left: -17 },
            'JumpsuitScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/shorts.png'),
            { width: 75, height: 37 },
            { width: 35, height: 25, top: 7, left: 18 },
            'eight',
            { marginRight: -29, marginTop: 2.6, left: -17 },
            'ShortScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/jacket.png'),
            { width: 75, height: 32.4 },
            { width: 35, height: 25, top: 7, left: 18 },
            'night',
            { marginRight: -31, marginTop: 3.8, left: -17 },
            'JacketScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/sweatpants.png'),
            { width: 75, height: 36.8 },
            { width: 35, height: 25, top: 7, left: 18 },
            'ten',
            { marginRight: -28, marginTop: 2.6, left: -17 },
            'SweatpantsScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/skirts.png'),
            { width: 75, height: 36.8 },
            { width: 35, height: 25, top: 7, left: 18 },
            'eleven',
            { marginRight: -30, marginTop: 2.8, left: -17 },
            'SkirtScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/sweater.png'),
            { width: 75, height: 33.6 },
            { width: 35, height: 25, top: 7, left: 18 },
            'twelve',
            { marginRight: -30, marginTop: 2.8, left: -17 },
            'SweaterScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/pants.png'),
            { width: 75, height: 36.8 },
            { width: 35, height: 25, top: 7, left: 18 },
            'thirtheen',
            { marginRight: -30, marginTop: 2.8, left: -17 },
            'PantsScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/leggins.png'),
            { width: 75, height: 36.8 },
            { width: 35, height: 25, top: 7, left: 18 },
            'fourtheen',
            { marginRight: -28, marginTop: 2.8, left: -17 },
            'LeggingsScreen'
          )}
          
          {renderImageWithTouchableOpacity(
            require('../../assets/images/coat.png'),
            { width: 75, height: 33.7 },
            { width: 35, height: 25, top: 7, left: 18 },
            'fifthteen',
            { marginRight: -30, marginTop: 2.7, left: -17 },
            'CoatScreen'
          )}
          <View style={{ width: safeResponsiveDimension(20, SCREEN_WIDTH) }} />
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
  scrollContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: safeResponsiveDimension(44, SCREEN_HEIGHT),
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: safeResponsiveDimension(5, SCREEN_WIDTH),
    paddingVertical: safeResponsiveDimension(3, SCREEN_HEIGHT),
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
    top: safeResponsiveDimension(8, SCREEN_HEIGHT),
    left: safeResponsiveDimension(1, SCREEN_WIDTH),
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
    borderRadius: safeResponsiveDimension(2, SCREEN_WIDTH),
  },
  transformedProfileImage: {
    transform: [{ scaleX: 0.87 }],
  },
  errorContainer: {
    position: 'absolute',
    bottom: safeResponsiveDimension(2, SCREEN_HEIGHT),
    left: safeResponsiveDimension(2, SCREEN_WIDTH),
    right: safeResponsiveDimension(2, SCREEN_WIDTH),
    padding: safeResponsiveDimension(1, SCREEN_WIDTH),
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: safeResponsiveDimension(0.5, SCREEN_WIDTH),
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AllScreen;