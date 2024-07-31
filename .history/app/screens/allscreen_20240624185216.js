import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width: screenWidth } = Dimensions.get('window');

const AllScreen = () => {
  // ... (předchozí kód zůstává stejný)

  const scrollViewRef = useRef(null);

  const scrollToOffset = (offset) => {
    scrollViewRef.current?.scrollTo({ x: offset, animated: true });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.scrollContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
          decelerationRate="fast"
          snapToInterval={240} // Šířka položky + mezera
          snapToAlignment="start"
          pagingEnabled={false}
        >
          <TouchableOpacity onPress={handledresscPress} style={styles.scrollItem}>
            <Image source={require('../../assets/images/dresso.png')} style={styles.image} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handletshirtcPress} style={styles.scrollItem}>
            <Image source={require('../../assets/images/topps.png')} style={styles.image} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handletshirtcPress} style={styles.scrollItem}>
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

      {/* ... (zbytek kódu zůstává stejný) */}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (předchozí styly zůstávají stejné)

  scrollContainer: {
    position: 'absolute',
    height: 240,
    top: 270,
    left: 0,
    right: 0,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollItem: {
    width: 230,
    marginRight: 10,
  },
  image: {
    width: 230,
    height: 230,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // ... (zbytek stylů zůstává stejný)
});

export default AllScreen;