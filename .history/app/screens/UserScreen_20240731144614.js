import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList, Text, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '@/auth';
import { BASE_URL } from '@config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const MAX_TRY_ON_RESULTS = 100;

const UserScreen = () => {
  console.log('UserScreen se renderuje');
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, selectedProfileIndex: initialSelectedProfileIndex = 0 } = route.params || {};
  const flatListRef = useRef(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(initialSelectedProfileIndex);

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect se spouští');
      const loadData = async () => {
        try {
          setIsLoading(true);
          if (!userId) {
            console.log('userId není k dispozici, zobrazuji pouze rozcestník');
            setIsLoading(false);
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
          setError('Došlo k chybě při načítání dat: ' + (error.message || 'Neznámá chyba'));
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }, [userId, route.params?.deletedItemId])
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
      setProfileImageUrl(activeImageUrl);
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
      console.error('Chyba při načítání výsledků try-on:', error.response ? error.response.data : error.message);
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
    const isFromImageDetail = item.imageUrl?.includes('from_image_detail=true');
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
              selectedProfileIndex: index
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
              navigation.navigate(targetScreen, { userId, selectedProfileIndex });
            }
          }}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Načítání...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.container}>
        {renderImageWithTouchableOpacity(
          require('../../assets/images/nandezud.png'),
          styles.nandezuImage,
          styles.nandezuButton,
          'treti',
          styles.nandezuContainer,
          'UserScreen'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/loved.png'),
          styles.loveImage,
          styles.loveButton,
          'loves',
          styles.loveContainer,
          'ManageProfilePictures'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/subsd.png'),
          styles.subsImage,
          styles.subsButton,
          'subs',
          styles.subsContainer,
          'ProfileSetScreen'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/allp.png'),
          styles.allpImage,
          styles.allpButton,
          'allp',
          styles.allpContainer,
          'ProfileResultsScreen'
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={profiles}
        renderItem={renderProfileItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={handleScroll}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
        contentContainerStyle={styles.flatListContent}
        initialScrollIndex={selectedProfileIndex}
        getItemLayout={(data, index) => (
          { length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileItemContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  transformedProfileImage: {
    width: CONTAINER_WIDTH * 0.8,
    height: CONTAINER_HEIGHT * 0.8,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.8,
  },
  button: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pressedImage: {
    opacity: 0.5,
  },
  nandezuContainer: {
    flex: 1,
  },
  loveContainer: {
    flex: 1,
  },
  subsContainer: {
    flex: 1,
  },
  allpContainer: {
    flex: 1,
  },
  flatListContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserScreen;
