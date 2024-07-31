import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SubScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  console.log('SubScreen - Received userId:', userId);

  const plans = [
    { image: require('../../assets/images/freeplan.png'), name: 'Free Plan', color: '#4CAF50' },
    { image: require('../../assets/images/basicplan.png'), name: 'Basic Plan', color: '#2196F3' },
    { image: require('../../assets/images/proplan.png'), name: 'Pro Plan', color: '#FFC107' },
    { image: require('../../assets/images/premiumplan.png'), name: 'Premium Plan', color: '#E91E63' },
  ];

  const renderImageWithButtons = (imageSource, planName, buttonColor) => (
    <View style={styles.planContainer}>
      <Image
        source={imageSource}
        style={styles.planImage}
        resizeMode="contain"
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#FFC05F' }]}>
          <Text style={styles.orderButtonText}>Buy Month</Text>
        </TouchableOpacity>
        <Text style={styles.discountText}>20% discount on yearly plan</Text>
        <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#FFC05F' }]}>
          <Text style={styles.orderButtonText}>Buy Year</Text>
        </TouchableOpacity>
      </View>
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
            {renderImageWithButtons(plan.image, plan.name, plan.color)}
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
    height: SCREEN_HEIGHT * 0.6,
  },
  buttonsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  orderButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
    marginVertical: 10,
  },
  orderButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountText: {
    color: '#FFF',
    fontSize: 14,
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