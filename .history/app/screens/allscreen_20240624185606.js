import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width: screenWidth } = Dimensions.get('window');

const AllScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
        setProfileImage(response.data.profile_image);
        setLoading(false);
      } catch (error) {
        setError('Failed to load user data. Please try again.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleNandezuPress = () => {
    navigation.navigate('NandezuScreen', { userId });
  };

  const handleSubsPress = () => {
    navigation.navigate('SubsScreen', { userId });
  };

  const handleDresscPress = () => {
    console.log('Dressc button pressed');
  };

  const handleTshirtcPress = () => {
    console.log('Tshirtc button pressed');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
        decelerationRate="normal"
        snapToInterval={240}
        snapToAlignment="center"
        pagingEnabled={false}
      >
        <TouchableOpacity onPress={handleDresscPress} style={styles.scrollItem}>
          <Image source={require('../../assets/images/dresso.png')} style={styles.image} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTshirtcPress} style={styles.scrollItem}>
          <Image source={require('../../assets/images/topps.png')} style={styles.image} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTshirtcPress} style={styles.scrollItem}>
          <Image source={require('../../assets/images/tshirtc.png')} style={styles.image} resizeMode="contain" />
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity onPress={handleNandezuPress} style={styles.absoluteButton}>
        <Image source={require('../../assets/images/nandezu.png')} style={styles.nandezuImage} resizeMode="contain" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubsPress} style={styles.absoluteButton}>
        <Image source={require('../../assets/images/subs.png')} style={styles.subsImage} resizeMode="contain" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubsPress} style={styles.absoluteButton}>
        <Image source={require('../../assets/images/alles.png')} style={styles.allesImage} resizeMode="contain" />
      </TouchableOpacity>

      <Image source={{ uri: profileImage }} style={styles.profileImage} resizeMode="contain" />
      <Image source={require('../../assets/images/finger.png')} style={styles.fingerImage} resizeMode="contain" />
      <Image source={require('../../assets/images/square.png')} style={styles.squareImage} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06022A',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 100,
  },
  scrollItem: {
    width: 230,
    marginRight: 10,
  },
  image: {
    width: 230,
    height: 230,
  },
  absoluteButton: {
    position: 'absolute',
  },
  profileImage: {
    width: 400,
    height: 400,
    aspectRatio: 1,
    position: 'absolute',
    top: 65,
    transform: [{ translateX: -10 }],
    zIndex: 2,
  },
  nandezuImage: {
    width: 130,
    height: 130,
    position: 'absolute',
    top: -392,
    transform: [{ translateX: -62 }],
    alignItems: 'center',
    zIndex: 10,
  },
  allesImage: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: -20,
    transform: [{ translateX: -160 }],
    alignItems: 'center',
    zIndex: 10,
  },
  subsImage: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: -340,
    transform: [{ translateX: -155 }],
    alignItems: 'center',
    zIndex: 3,
  },
  fingerImage: {
    width: 28,
    height: 28,
    position: 'absolute',
    top: 37,
    left: '50%',
    width: '80%',
    transform: [{ translateX: +1 }],
    alignItems: 'center',
    zIndex: 4,
  },
  squareImage: {
    width: 340,
    height: 340,
    position: 'absolute',
    top: 100,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -144 }],
    alignItems: 'center',
    zIndex: 1,
  },
});

export default AllScreen;