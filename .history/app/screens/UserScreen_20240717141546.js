import React, { useState, useRef, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '@/auth';
import { useProfile } from '../../ProfileProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const UserScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const flatListRef = useRef(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

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
      setError('Nepodařilo se načíst výsledky try-on.');
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
      {profileImageUrl && (
        <FlatList
          ref={flatListRef}
          data={profiles}
          renderItem={renderProfileItem}
          extraData={selectedProfileIndex}
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
        require('../../assets/images/nandezud.png'),
        styles.nandezuImage,
        styles.nandezuButton,
        'treti',
        styles.nandezuContainer,
        'AllScreen'
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
        'AllScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/aip.png'),
        styles.aipImage,
        styles.aipButton,
        'aip',
        styles.aipContainer,
        'AIScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/newp.png'),
        styles.newpImage,
        styles.newpButton,
        'newp',
        styles.newpContainer,
        'NewScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/mep.png'),
        styles.mepImage,
        styles.mepButton,
        'mep',
        styles.mepContainer,
        'FavoriteUserScreen'
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3D5DB',
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
  nandezuContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * -0.01,
    left: SCREEN_WIDTH * 0.330,
    zIndex: 2,
  },
  nandezuImage: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.16,
  },
  nandezuButton: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.16,
    top: SCREEN_HEIGHT * 0.025,
    left: SCREEN_WIDTH * 0.1,
  },
  loveContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.052,
    left: SCREEN_WIDTH * 0.88,
    zIndex: 2,
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
    top: SCREEN_HEIGHT * 0.050,
    left: SCREEN_WIDTH * 0.050,
    zIndex: 2,
  },
  subsImage: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.04,
  },
  subsButton: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.04,
  },
  allpContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.70,
    left: SCREEN_WIDTH * -0.072,
    zIndex: 2,
  },
  allpImage: {
    width: SCREEN_WIDTH * 0.51,
    height: SCREEN_HEIGHT * 0.260,
  },
  allpButton: {
    width: SCREEN_WIDTH * 0.51,
    height: SCREEN_HEIGHT * 0.260,
  },
  aipContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.57,
    left: SCREEN_WIDTH * 0.250,
    zIndex: 3,
  },
  aipImage: {
    width: SCREEN_WIDTH * 0.51,
    height: SCREEN_HEIGHT * 0.260,
  },
  aipButton: {
    width: SCREEN_WIDTH * 0.51,
    height: SCREEN_HEIGHT * 0.260,
  },
  newpContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.72,
    left: SCREEN_WIDTH * 0.560,
    zIndex: 2,
  },
  newpImage: {
    width: SCREEN_WIDTH * 0.52,
    height: SCREEN_HEIGHT * 0.260,
  },
  newpButton: {
    width: SCREEN_WIDTH * 0.52,
    height: SCREEN_HEIGHT * 0.260,
  },
  mepContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.82,
    left: SCREEN_WIDTH * 0.240,
    zIndex: 2,
  },
  mepImage: {
    width: SCREEN_WIDTH * 0.51,
    height: SCREEN_HEIGHT * 0.230,
  },
  mepButton: {
    width: SCREEN_WIDTH * 0.51,
    height: SCREEN_HEIGHT * 0.230,
  },
});

export default UserScreen;
