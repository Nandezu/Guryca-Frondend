import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SubScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId = null } = route.params || {};

  const plans = [
    { image: require('../../assets/images/freeplan.png'), name: 'Free Plan', color: '#4CAF50' },
    { image: require('../../assets/images/basicplan.png'), name: 'Basic Plan', color: '#2196F3' },
    { image: require('../../assets/images/proplan.png'), name: 'Pro Plan', color: '#FFC107' },
    { image: require('../../assets/images/premiumplan.png'), name: 'Premium Plan', color: '#E91E63' },
  ];

  const renderImageWithButton = (imageSource, planName, buttonColor) => (
    <View style={styles.planContainer}>
      <Image
        source={imageSource}
        style={styles.planImage}
        resizeMode="contain"
      />
      <TouchableOpacity style={[styles.orderButton, { backgroundColor: buttonColor }]}>
        <Text style={styles.orderButtonText}>Order</Text>
      </TouchableOpacity>
    </View>
  );

  const handleNandezuPress = () => {
    navigation.navigate('UserScreen', { userId });
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
            {renderImageWithButton(plan.image, plan.name, plan.color)}
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
    height: SCREEN_HEIGHT * 0.8,
  },
  planImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
  },
  orderButton: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
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