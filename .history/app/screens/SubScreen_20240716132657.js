import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SubScreen = () => {
  const navigation = useNavigation();

  const plans = [
    { image: require('../../assets/images/freeplan.png'), name: 'Free Plan' },
    { image: require('../../assets/images/basicplan.png'), name: 'Basic Plan' },
    { image: require('../../assets/images/proplan.png'), name: 'Pro Plan' },
    { image: require('../../assets/images/premiumplan.png'), name: 'Premium Plan' },
  ];

  const renderImageWithButton = (imageSource, planName) => (
    <View style={styles.planContainer}>
      <Image
        source={imageSource}
        style={styles.planImage}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.nandezu}
        onPress={() => navigation.navigate('UserScreen')}
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
            {renderImageWithButton(plan.image, plan.name)}
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
  },
  planImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.6,
  },
  orderButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  orderButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nandezu: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.05,
    left: SCREEN_WIDTH * 0.33,
    zIndex: 2,
  },
  nandezuImage: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.16,
  },
});

export default SubScreen;