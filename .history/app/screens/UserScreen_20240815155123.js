import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Text, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '@/auth';
import { BASE_URL } from '@config';
import { useProfile } from '../../ProfileProvider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CONTAINER_WIDTH = wp('55%');
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const MAX_TRY_ON_RESULTS = 100;

const UserScreen = () => {
  console.log('UserScreen se renderuje');
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
    const index = Math.round(contentOffset / wp('100%'));
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Načítání...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
              length: wp('100%'),
              offset: wp('100%') * index,
              index,
            })}
            initialScrollIndex={selectedProfileIndex}
            removeClippedSubviews={true}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            decelerationRate="fast"
            snapToAlignment="center"
            snapToInterval={wp('100%')}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#CFD6DE',
  },
  container: {
    flex: 1,
    position: 'relative',
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
    position: 'absolute',
    top: hp('8%'),
    left: wp('1%'),
    width: wp('100%'),
    height: CONTAINER_HEIGHT,
    zIndex: 2,
  },
  profileItemContainer: {
    width: wp('100%'),
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
    top: hp('2%'),
    left: wp('33%'),
    zIndex: 2,
  },
  nandezuImage: {
    width: wp('35%'),
    height: hp('8%')
  },
  nandezuButton: {
    width: wp('35%'),
    height: hp('8%'),
  },
  loveContainer: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('5%'),
    zIndex: 2,
  },
  loveImage: {
    width: wp('7%'),
    height: hp('3.5%'),
  },
  loveButton: {
    width: wp('7%'),
    height: hp('3.5%'),
  },
  subsContainer: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('5%'),
    zIndex: 2,
  },
  subsImage: {
    width: wp('8%'),
    height: hp('4%'),
  },
  subsButton: {
    width: wp('8%'),
    height: hp('4%'),
  },
  allpContainer: {
    position: 'absolute',
    bottom: hp('20%'),
    left: wp('0%'),
    zIndex: 2,
  },
  allpImage: {
    width: wp('48%'),
    height: hp('24%'),
  },
  allpButton: {
    width: wp('48%'),
    height: hp('24%'),
  },
  aipContainer: {
    position: 'absolute',
    bottom: hp('23%'),
    left: wp('25%'),
    zIndex: 3,
  },
  aipImage: {
    width: wp('48%'),
    height: hp('24%'),
  },
  aipButton: {
    width: wp('48%'),
    height: hp('24%'),
  },
  newpContainer: {
    position: 'absolute',
    bottom: hp('20%'),
    right: wp('0%'),
    zIndex: 2,
  },
  newpImage: {
    width: wp('48%'),
    height: hp('24%'),
  },
  newpButton: {
    width: wp('48%'),
    height: hp('24%'),
  },
  mepContainer: {
    position: 'absolute',
    bottom: hp('5%'),
    left: wp('25%'),
    zIndex: 2,
  },
  mepImage: {
    width: wp('48%'),
    height: hp('20%'),
  },
  mepButton: {
    width: wp('48%'),
    height: hp('20%'),
  },
});

export default UserScreen;