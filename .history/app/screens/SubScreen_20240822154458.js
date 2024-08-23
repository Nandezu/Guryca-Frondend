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

      console.log('Fetching subscriptions for product IDs:', productIds);

      const availableProducts = await RNIap.getSubscriptions(productIds);
      console.log('Available subscriptions:', availableProducts);

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
      const verificationResponse = await axios.post(`${BASE_URL}/verify-purchase/`, {
        product_id: productId,
        purchase_token: purchase.purchaseToken || purchase.transactionReceipt,
        transaction_id: purchase.transactionId,
        is_ios: Platform.OS === 'ios'
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      console.log('Purchase verification response:', verificationResponse.data);

      if (!verificationResponse.data.success) {
        throw new Error('Failed to verify purchase');
      }
    } catch (error) {
      handleError(error, 'Failed to verify purchase. Please try again or contact support.');
    }
  };

  const handleChangeSubscription = async (newPlanType, duration) => {
    try {
      console.log('Handling change subscription...');
      const token = await getToken();
      const response = await axios.post(`${BASE_URL}/subscription/change/`, {
        new_product_id: getProductId(newPlanType, duration),
        subscription_type: newPlanType
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      console.log('Change subscription response:', response.data);

      if (response.data.success) {
        Alert.alert('Subscription Changed', 'Your subscription has been updated.');
        await fetchSubscriptionDetails();
      } else {
        throw new Error('Failed to change subscription');
      }
    } catch (error) {
      handleError(error, 'Failed to change subscription');
    }
  };

  const getProductId = (planType, duration) => {
    const productMap = SUBSCRIPTION_PRODUCTS[Platform.OS];
    if (planType === 'basic') {
      return duration === 'monthly' ? productMap.BASIC_MONTHLY : productMap.BASIC_ANNUAL;
    }
    if (planType === 'pro') {
      return duration === 'monthly' ? productMap.PRO_MONTHLY : productMap.PRO_ANNUAL;
    }
    if (planType === 'premium') {
      return duration === 'monthly' ? productMap.PREMIUM_MONTHLY : productMap.PREMIUM_ANNUAL;
    }
    throw new Error('Unknown plan type or duration');
  };

  const handleError = (error, message) => {
    console.error(message, error.message, error);
    Alert.alert('Error', message);
  };

  const renderPlanButton = (plan) => (
    <TouchableOpacity
      key={plan.name}
      style={[styles.planButton, { marginBottom: BUTTON_CONFIG.marginVertical }]}
      onPress={() => handleBuySubscription(plan.type, 'monthly')}
    >
      <Image source={plan.image} style={styles.planImage} />
      <Text style={styles.planText}>{plan.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleNandezuPress}>
            <Text style={styles.headerText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.plansContainer}>
          {availablePlans.length > 0 ? (
            availablePlans.map(renderPlanButton)
          ) : (
            <Text style={styles.noPlansText}>No available plans at the moment.</Text>
          )}
        </View>
        {showCancelButton && (
          <TouchableOpacity
            style={[styles.cancelButton, { marginBottom: BUTTON_CONFIG.marginVertical }]}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.02,
  },
  scrollView: {
    paddingBottom: BUTTONS_BOTTOM_OFFSET,
  },
  header: {
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  headerText: {
    fontSize: 18,
    color: '#007BFF',
  },
  plansContainer: {
    flex: 1,
  },
  planButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
  },
  planImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT * 0.2,
    resizeMode: 'contain',
  },
  planText: {
    fontSize: 16,
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  noPlansText: {
    textAlign: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
    fontSize: 16,
    color: '#888',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    borderRadius: 8,
    padding: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SubScreen;
