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
    // Přidejte zde logiku pro dressc tlačítko
    console.log('Dressc button pressed');
  };

  const handleTshirtcPress = () => {
    // Přidejte zde logiku pro tshirtc tlačítko
    console.log('Tshirtc button pressed');
  };

  const scrollToOffset = (offset) => {
    scrollViewRef.current?.scrollTo({ x: offset, animated: true });
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
      <View style={styles.scrollContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
          decelerationRate="fast"
          snapToInterval={240}
          snapToAlignment="start"
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
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={() => scrollToOffset(0)} style={styles.navButton}>
          <Text style={styles.navButtonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToOffset(240)} style={styles.navButton}>
          <Text style={styles.navButtonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToOffset(480)} style={styles.navButton}>
          <Text style={styles.navButtonText}>3</Text>
        </TouchableOpacity>
      </View>

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

// ... (styly zůstávají stejné)

export default AllScreen;