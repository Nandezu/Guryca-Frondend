import React, { useState, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSubscription } from 'src/contexts/SubscriptionContext';
import axios from 'axios';
import { getToken } from '../../auth';
import { BASE_URL } from '@config';
import * as RNIap from 'react-native-iap';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BUTTONS_BOTTOM_OFFSET = SCREEN_HEIGHT * -0.08;

const BUTTON_CONFIG = {
  width: SCREEN_WIDTH * 0.6,
  height: SCREEN_HEIGHT * 0.05,
  marginVertical: SCREEN_HEIGHT * 0.01,
};

const SUBSCRIPTION_PRODUCTS = {
  iOS: {
    BASIC_MONTHLY: 'com.nandezu.basic_monthly',
    PRO_MONTHLY: 'com.nandezu.promonthly',
    PREMIUM_MONTHLY: 'com.nandezu.premiummonthly',
    BASIC_ANNUAL: 'com.nandezu.basicannual',
    PRO_ANNUAL: 'com.nandezu.proannual',
    PREMIUM_ANNUAL: 'com.nandezu.premiumannual',
  },
  android: {
    BASIC_MONTHLY: 'basic.monthly',
    PRO_MONTHLY: 'pro.monthly',
    PREMIUM_MONTHLY: 'premium.monthly',
    BASIC_ANNUAL: 'basic.annual',
    PRO_ANNUAL: 'pro.annual',
    PREMIUM_ANNUAL: 'premium.annual',
  }
};

const SubScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;
  const { virtualTryOnsRemaining, updateSubscriptionLimits } = useSubscription();
  const [userSubscription, setUserSubscription] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(true);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [products, setProducts] = useState([]);

  console.log('SubScreen - Received userId:', userId);

  const planImages = {
    'Free Plan': require('../../assets/images/freeplan.png'),
    'Basic Plan': require('../../assets/images/basicplan.png'),
    'Pro Plan': require('../../assets/images/proplan.png'),
    'Premium Plan': require('../../assets/images/premiumplan.png'),
  };

  const initializeIAP = async () => {
    try {
      console.log('Initializing IAP connection...');
      await RNIap.initConnection();
      console.log('IAP connection initialized successfully.');

      const productIds = Platform.OS === 'ios'
        ? Object.values(SUBSCRIPTION_PRODUCTS.iOS)
        : Object.values(SUBSCRIPTION_PRODUCTS.android);

      console.log('Product IDs:', productIds);

      const availableProducts = await RNIap.getSubscriptions(productIds);
      console.log('Available products:', availableProducts);

      if (availableProducts.length === 0) {
        console.warn('No products available');
      } else {
        setProducts(availableProducts);
      }
    } catch (error) {
      console.error('Failed to initialize IAP or fetch subscriptions:', error.message, error);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log('Initializing component...');
      await initializeIAP();
      await fetchAvailablePlans();
    };
    init();

    return () => {
      console.log('Cleaning up IAP connection...');
      RNIap.endConnection();
    };
  }, []);

  const fetchAvailablePlans = async () => {
    try {
      console.log('Fetching available plans...');
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/subscription/plans/`, {
        headers: { Authorization: `Token ${token}` }
      });
      console.log('Available plans response:', response.data);

      const plansWithImages = response.data.map(plan => ({
        ...plan,
        image: planImages[plan.name],
        isFree: plan.name === 'Free Plan'
      })).filter(plan => plan.image !== undefined);

      setAvailablePlans(plansWithImages);
    } catch (error) {
      handleError(error, 'Failed to fetch available plans');
    }
  };

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      console.log('Fetching subscription details...');
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/subscription/details/`, {
        headers: { Authorization: `Token ${token}` }
      });
      console.log('Subscription details response:', JSON.stringify(response.data, null, 2));

      const newSubscription = response.data.subscription_type;
      setUserSubscription(newSubscription);
      setIsCancelled(response.data.is_cancelled);
      updateSubscriptionLimits(response.data);

      const lastSubscription = await AsyncStorage.getItem('lastSubscription');
      const lastShowCancelButton = await AsyncStorage.getItem('showCancelButton');

      if (lastSubscription !== newSubscription) {
        console.log('Updating showCancelButton to true');
        setShowCancelButton(true);
        await AsyncStorage.setItem('showCancelButton', 'true');
      } else {
        console.log('Maintaining current showCancelButton value:', lastShowCancelButton);
        setShowCancelButton(lastShowCancelButton === 'true');
      }

      await AsyncStorage.setItem('lastSubscription', newSubscription);
    } catch (error) {
      handleError(error, 'Error fetching subscription details');
    }
  }, [updateSubscriptionLimits]);

  useFocusEffect(
    useCallback(() => {
      console.log('Fetching subscription details on screen focus...');
      fetchSubscriptionDetails();
    }, [fetchSubscriptionDetails])
  );

  const handleNandezuPress = () => {
    if (userId) {
      console.log('Navigating to UserScreen with userId:', userId);
      navigation.navigate('UserScreen', { userId: userId });
    } else {
      console.error('userId is undefined in SubScreen');
      navigation.navigate('UserScreen');
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? Your subscription will remain active until the end of the current billing period, after which you will lose access to premium features.',
      [
        {
          text: 'No, Keep Subscription',
          onPress: () => console.log('Cancel Subscription Cancelled'),
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel Subscription',
          onPress: async () => {
            try {
              console.log('Attempting to cancel subscription...');
              const token = await getToken();
              const response = await axios.post(`${BASE_URL}/subscription/cancel/`, {}, {
                headers: { Authorization: `Token ${token}` }
              });

              console.log('Subscription cancellation response:', response.data);
              Alert.alert('Subscription Cancelled', 'Your subscription has been cancelled and will end at the end of the current billing period.');
              setShowCancelButton(false);
              await AsyncStorage.setItem('showCancelButton', 'false');
              fetchSubscriptionDetails();
            } catch (error) {
              handleError(error, 'Failed to cancel subscription');
            }
          }
        }
      ]
    );
  };

  const handleBuySubscription = async (planType, duration) => {
    try {
      console.log('Handling buy subscription...');
      if (products.length === 0) {
        console.warn('No products available');
        return;
      }

      const productId = getProductId(planType, duration);
      console.log('Requesting subscription for productId:', productId);
      const purchase = await RNIap.requestSubscription(productId);
      console.log('Purchase response:', purchase);
      await verifyPurchase(productId, purchase);
      
      Alert.alert('Success', 'Your subscription has been activated!');
      await fetchSubscriptionDetails();
    } catch (error) {
      console.error('Purchase error:', error.message, error);
      if (!error.userCancelled) {
        handleError(error, 'An error occurred while processing your request');
      }
    }
  };

  const verifyPurchase = async (productId, purchase) => {
    try {
      console.log('Verifying purchase...');
      const token = await getToken();
      const verificationResponse = await axios.post(`${BASE_URL}/subscription/verify/`, {
        purchaseToken: purchase.purchaseToken,
        productId: productId
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      console.log('Purchase verification response:', verificationResponse.data);
    } catch (error) {
      console.error('Purchase verification failed:', error.message, error);
      throw new Error('Purchase verification failed');
    }
  };

  const getProductId = (planType, duration) => {
    const platformProducts = Platform.OS === 'ios' ? SUBSCRIPTION_PRODUCTS.iOS : SUBSCRIPTION_PRODUCTS.android;
    return platformProducts[`${planType}_${duration}`];
  };

  const handleError = (error, message) => {
    console.error(message, error.message, error);
    Alert.alert('Error', message);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {availablePlans.map(plan => (
          <View key={plan.name} style={styles.planContainer}>
            <Image source={plan.image} style={styles.planImage} />
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planFeatures}>{plan.features.join(', ')}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buyButton]}
              onPress={() => handleBuySubscription(plan.name, 'monthly')}
            >
              <Text style={styles.buttonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        ))}
        {showCancelButton && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.buttonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.profileButton]} onPress={handleNandezuPress}>
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: SCREEN_WIDTH * 0.8,
    alignItems: 'center',
  },
  planContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: SCREEN_HEIGHT * 0.02,
  },
  planImage: {
    width: BUTTON_CONFIG.width,
    height: BUTTON_CONFIG.height,
    resizeMode: 'contain',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
  planPrice: {
    fontSize: 18,
    color: '#00f',
  },
  planFeatures: {
    fontSize: 16,
    color: '#555',
    marginVertical: SCREEN_HEIGHT * 0.01,
    textAlign: 'center',
  },
  button: {
    width: BUTTON_CONFIG.width,
    height: BUTTON_CONFIG.height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buyButton: {
    backgroundColor: '#0f0',
  },
  cancelButton: {
    backgroundColor: '#f00',
    marginTop: BUTTONS_BOTTOM_OFFSET,
  },
  profileButton: {
    backgroundColor: '#00f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SubScreen;
