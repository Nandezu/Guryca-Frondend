import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Nastavení pro velikost a umístění tlačítek
const BUTTON_CONFIG = {
  width: SCREEN_WIDTH * 0.6,
  height: SCREEN_HEIGHT * 0.04,
  marginVertical: SCREEN_HEIGHT * 0.01,
  bottomOffset: SCREEN_HEIGHT * 0.1, // Vzdálenost tlačítek od spodní části obrazovky
};

const SubScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  console.log('SubScreen - Received userId:', userId);

  const plans = [
    { image: require('../../assets/images/freeplan.png'), name: 'Free Plan', color: '#4CAF50', isFree: true },
    { image: require('../../assets/images/basicplan.png'), name: 'Basic Plan', color: '#2196F3', isFree: false },
    { image: require('../../assets/images/proplan.png'), name: 'Pro Plan', color: '#FFC107', isFree: false },
    { image: require('../../assets/images/premiumplan.png'), name: 'Premium Plan', color: '#E91E63', isFree: false },
  ];

  const renderImageWithButtons = (imageSource, planName, buttonColor, isFree) => (
    <View style={styles.planContainer}>
      <Image
        source={imageSource}
        style={styles.planImage}
        resizeMode="contain"
      />
      {!isFree && (
        <View style={[styles.buttonsContainer, { bottom: BUTTON_CONFIG.bottomOffset }]}>
          <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#FFC05F' }]}>
            <Text style={styles.orderButtonText}>Buy Month</Text>
          </TouchableOpacity>
          <Text style={styles.discountText}>20% discount on yearly plan</Text>
          <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#FFC05F' }]}>
            <Text style={styles.orderButtonText}>Buy Year</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleNandezuPress = () => {
    console.log('SubScreen - Navigating back to UserScreen with userId:', userId);
    if (userId) {
      navigation.navigate('UserScreen', { userId: userId });
    } else {
      console.error('userId is undefined in SubScreen');
      navigation.navigate('UserScreen');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.nandezu}
        onPress={handleNandezuPress}
      >
        <Image
          source={require('../../assets/images/nandezu.png')}
          style={styles.nandezuImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {plans.map((plan, index) => (
          <View key={index} style={styles.planWrapper}>
            {renderImageWithButtons(plan.image, plan.name, plan.color, plan.isFree)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  planWrapper: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  planImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.6,
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  buttonsContainer: {
    alignItems: 'center',
    position: 'absolute',
    width: SCREEN_WIDTH,
  },
  orderButton: {
    width: BUTTON_CONFIG.width,
    height: BUTTON_CONFIG.height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: BUTTON_CONFIG.marginVertical,
  },
  orderButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  discountText: {
    color: '#FFF',
    fontSize: 12,
    marginVertical: 5,
  },
  nandezu: {
    position: 'absolute',
    top: SCREEN_HEIGHT * -0.01,
    left: SCREEN_WIDTH * 0.33,
    zIndex: 2,
  },
  nandezuImage: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.16,
  },
});

export default SubScreen;