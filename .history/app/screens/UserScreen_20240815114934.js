import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList, Text, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '@/auth';
import { BASE_URL } from '@config';
import { useProfile } from '../../ProfileProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRY_ON_RESULTS = 100;

const UserScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const flatListRef = useRef(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { profiles, setProfiles, selectedProfileIndex, setSelectedProfileIndex } = useProfile();

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
  }, [route.params?.selectedProfileIndex, setSelectedProfileIndex]);

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

  const renderButton = (imageSource, onPress, style, imageStyle) => (
    <TouchableOpacity onPress={onPress} style={[styles.iconButton, style]}>
      <Image source={imageSource} style={[styles.iconImage, imageStyle]} />
    </TouchableOpacity>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safeArea}>
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

        <View style={styles.buttonContainer}>
          <View style={styles.topButtonsRow}>
            {renderButton(
              require('../../assets/images/subsd.png'),
              () => navigation.navigate('ProfileSetScreen', { userId }),
              {},
              { width: 40, height: 40 }
            )}
            {renderButton(
              require('../../assets/images/nandezud.png'),
              () => navigation.navigate('UserScreen', { userId }),
              {},
              { width: 120, height: 60 }
            )}
            {renderButton(
              require('../../assets/images/loved.png'),
              () => navigation.navigate('ManageProfilePictures', { userId }),
              {},
              { width: 30, height: 30 }
            )}
          </View>

          <View style={styles.bottomButtonsContainer}>
            <View style={styles.bottomButtonsRow}>
              {renderButton(
                require('../../assets/images/allp.png'),
                () => navigation.navigate('AllScreen', { userId }),
                styles.largeIconButton,
                styles.largeIconImage
              )}
              {renderButton(
                require('../../assets/images/aip.png'),
                () => navigation.navigate('AIScreen', { userId }),
                styles.largeIconButton,
                styles.largeIconImage
              )}
              {renderButton(
                require('../../assets/images/newp.png'),
                () => navigation.navigate('NewScreen', { userId }),
                styles.largeIconButton,
                styles.largeIconImage
              )}
              {renderButton(
                require('../../assets/images/mep.png'),
                () => navigation.navigate('FavoriteUserScreen', { userId }),
                styles.largeIconButton,
                styles.largeIconImage
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CFD6DE',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CFD6DE',
  },
  profileScrollContainer: {
    height: '50%',
    width: '100%',
    position: 'absolute',
    top: '10%',
  },
  profileItemContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '55%',
    aspectRatio: 1 / 1.6,
    borderRadius: 20,
  },
  transformedProfileImage: {
    transform: [{ scaleX: 0.87 }],
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingTop: '3%',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 10,
  },
  iconImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  largeIconButton: {
    padding: 10,
  },
  largeIconImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});

export default UserScreen;