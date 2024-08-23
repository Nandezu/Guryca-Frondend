import React, { useState, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView, Alert, Platform, Linking } from 'react-native';
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
  const [iapInitialized, setIapInitialized] = useState(false);

  console.log('SubScreen - Received userId:', userId);
  console.log('Current platform:', Platform.OS);
  console.log('Is production build:', !__DEV__);

  const planImages = {
    'Free Plan': require('../../assets/images/freeplan.png'),
    'Basic Plan': require('../../assets/images/basicplan.png'),
    'Pro Plan': require('../../assets/images/proplan.png'),
    'Premium Plan': require('../../assets/images/premiumplan.png'),
  };

  const planPrices = {
    'Free Plan': { monthly_price: 0, annual_price: 0 },
    'Basic Plan': { monthly_price: 9.99, annual_price: 99.99 },
    'Pro Plan': { monthly_price: 19.99, annual_price: 199.99 },
    'Premium Plan': { monthly_price: 29.99, annual_price: 299.99 },
  };

  const initializeIAP = async () => {
    try {
      console.log('Initializing IAP connection...');
      await RNIap.initConnection({
        debug: true,
        showLog: true,
      });
      console.log('IAP connection initialized successfully.');

      const productIds = Platform.OS === 'ios'
        ? Object.values(SUBSCRIPTION_PRODUCTS.iOS)
        : Object.values(SUBSCRIPTION_PRODUCTS.android);

      console.log('Fetching subscriptions for product IDs:', productIds);

      const availableProducts = await RNIap.getSubscriptions({ skus: productIds });
      console.log('Available subscriptions:', JSON.stringify(availableProducts, null, 2));

      if (availableProducts.length === 0) {
        console.warn('No products available from Google Play');
      } else {
        setProducts(availableProducts);
        console.log('Products set successfully:', availableProducts);
      }
      setIapInitialized(true);
    } catch (error) {
      console.error('Failed to initialize IAP or fetch subscriptions:', error.message, error);
      if (error.debugMessage) {
        console.error('Debug message:', error.debugMessage);
      }
      if (error.code) {
        console.error('Error code:', error.code);
      }
      setIapInitialized(true);
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

      const plansWithImagesAndPrices = response.data.map(plan => ({
        ...plan,
        image: planImages[plan.name],
        isFree: plan.name === 'Free Plan',
        monthly_price: planPrices[plan.name]?.monthly_price || 0,
        annual_price: planPrices[plan.name]?.annual_price || 0
      })).filter(plan => plan.image !== undefined);

      setAvailablePlans(plansWithImagesAndPrices);
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
      console.log('Current products:', products);
      console.log('Plan type:', planType, 'Duration:', duration);

      if (products.length === 0) {
        console.warn('No products available, attempting to reinitialize IAP');
        await initializeIAP();
        if (products.length === 0) {
          console.error('Still no products available after reinitialization');
          Alert.alert('Error', 'Unable to fetch subscription products. Please try again later.');
          return;
        }
      }

      const productId = getProductId(planType, duration);
      console.log('Requesting subscription for productId:', productId);
      
      const product = products.find(p => p.productId === productId);
      if (!product) {
        throw new Error(`Product not found for ID: ${productId}`);
      }

      console.log('Found product:', product);

      if (!product.subscriptionOfferDetails || product.subscriptionOfferDetails.length === 0) {
        throw new Error(`No subscription offers found for product: ${productId}`);
      }

      const offerToken = product.subscriptionOfferDetails[0].offerToken;
      console.log('Using offer token:', offerToken);

      const purchase = await RNIap.requestSubscription({
        sku: productId,
        subscriptionOffers: [{ sku: productId, offerToken }]
      });
      
      console.log('Purchase response:', purchase);
      await verifyPurchase(productId, purchase);
      
      Alert.alert('Success', 'Your subscription has been activated!');
      await fetchSubscriptionDetails();
    } catch (error) {
      console.error('Purchase error:', error.message, error);
      if (error.debugMessage) {
        console.error('Debug message:', error.debugMessage);
      }
      if (error.code) {
        console.error('Error code:', error.code);
      }
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
        is_ios: Platform.OS === 'ios'
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      console.log('Change subscription response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Your subscription has been changed successfully!');
        await fetchSubscriptionDetails();
      } else {
        throw new Error('Failed to change subscription');
      }
    } catch (error) {
      handleError(error, 'An error occurred while changing your subscription');
    }
  };

  const getProductId = (planType, duration) => {
    console.log('Getting product ID for:', planType, duration);
    const productPlatform = Platform.OS === 'ios' ? SUBSCRIPTION_PRODUCTS.iOS : SUBSCRIPTION_PRODUCTS.android;
    let productId;
    switch (planType.toLowerCase()) {
      case 'basic plan':
        productId = duration === 'monthly' ? productPlatform.BASIC_MONTHLY : productPlatform.BASIC_ANNUAL;
        break;
      case 'pro plan':
        productId = duration === 'monthly' ? productPlatform.PRO_MONTHLY : productPlatform.PRO_ANNUAL;
        break;
      case 'premium plan':
        productId = duration === 'monthly' ? productPlatform.PREMIUM_MONTHLY : productPlatform.PREMIUM_ANNUAL;
        break;
      default:
        throw new Error('Invalid plan type');
    }
    console.log('Selected product ID:', productId);
    return productId;
  };

  const handleError = (error, defaultMessage) => {
    console.error('Error:', error);
    const errorMessage = error.response?.data?.error || error.message || defaultMessage;
    Alert.alert('Error', errorMessage);
  };

  const isCurrentOrAnnualPlan = (planName) => {
    if (!userSubscription || typeof userSubscription !== 'string') return false;
    const currentPlanBase = userSubscription.replace('_annual', '');
    const planNameBase = planName.toLowerCase().replace(' plan', '');
    return currentPlanBase === planNameBase;
  };

  const openTermsAndConditions = () => {
    Linking.openURL('https://www.nandezu.com/');
  };

  const renderButtons = (plan) => {
    const isCurrentPlan = isCurrentOrAnnualPlan(plan.name);

    return (
      <View style={[styles.buttonsContainer, { bottom: BUTTONS_BOTTOM_OFFSET }]}>
      {isCurrentPlan && (
        <>
          <Text style={styles.currentPlanText}>Current Plan: {plan.name}</Text>
          <Text style={styles.tryOnsText}>TRY ONS Remaining: {virtualTryOnsRemaining}</Text>
          {!plan.isFree && showCancelButton && !isCancelled && (
            <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#FF0000', marginTop: 10 }]} onPress={handleCancelSubscription}>
              <Text style={styles.orderButtonText}>Cancel Subscription</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {!isCurrentPlan && !plan.isFree && (
        <>
          <TouchableOpacity
            style={[styles.orderButton, { backgroundColor: '#000' }]}
            onPress={() => handleBuySubscription(plan.name, 'monthly')}
          >
            <Text style={styles.orderButtonText}>{`BUY ${plan.name} Monthly`}</Text>
          </TouchableOpacity>
          <Text style={styles.priceText}>{`$${plan.monthly_price} USD per month`}</Text>
          
          <TouchableOpacity
            style={[styles.orderButton, { backgroundColor: '#000' }]}
            onPress={() => handleBuySubscription(plan.name, 'annual')}
          >
            <Text style={styles.orderButtonText}>{`BUY ${plan.name} Annual`}</Text>
          </TouchableOpacity>
          <Text style={styles.priceText}>{`$${plan.annual_price} USD per year`}</Text>
          
          <Text style={styles.discountText}>20% discount on Annual plan</Text>
        </>
      )}
    </View>
  );
};

const renderPlanImage = (plan, index) => {
  const isFreePlan = plan.name === 'Free Plan';
  const imageStyle = isFreePlan
    ? [styles.planImage, styles.freePlanImage]
    : styles.planImage;

  return (
    <View>
      <Image
        source={plan.image}
        style={imageStyle}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.termsButton} onPress={openTermsAndConditions}>
        <Text style={styles.termsButtonText}>Terms and Conditions</Text>
      </TouchableOpacity>
    </View>
  );
};

return (
  <View style={styles.container}>
    <TouchableOpacity style={styles.nandezu} onPress={handleNandezuPress}>
      <Image
        source={require('../../assets/images/nandezud.png')}
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
      {availablePlans.map((plan, index) => (
        <View key={index} style={styles.planWrapper}>
          {renderPlanImage(plan, index)}
          {renderButtons(plan)}
        </View>
      ))}
    </ScrollView>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#CFD6DE',
},
scrollView: {
  position: 'absolute',
  top: SCREEN_HEIGHT * 0.08,
  left: 0,
  right: 0,
  height: SCREEN_HEIGHT * 2,
},
planWrapper: {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT * 0.8,
  justifyContent: 'flex-start',
  alignItems: 'center',
},
planImage: {
  width: SCREEN_WIDTH * 0.8,
  height: SCREEN_HEIGHT * 0.5,
  marginTop: SCREEN_HEIGHT * 0.04,
},
freePlanImage: {
  width: SCREEN_WIDTH * 1.2,
  height: SCREEN_HEIGHT * 0.72,
  marginTop: SCREEN_HEIGHT * 0.050,
},
buttonsContainer: {
  position: 'absolute',
  left: 0,
  right: 0,
  alignItems: 'center',
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
  color: '#FFF',
  fontSize: 14,
  fontWeight: 'bold',
  textAlign: 'center',
},
discountText: {
  color: '#000',
  fontSize: 12,
  marginVertical: 5,
},
nandezu: {
  position: 'absolute',
  top: SCREEN_HEIGHT * -0.05,
  left: SCREEN_WIDTH * 0.33,
  zIndex: 2,
},
nandezuImage: {
  width: SCREEN_WIDTH * 0.35,
  height: SCREEN_HEIGHT * 0.16,
},
tryOnsText: {
  color: '#000',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 20,
},
priceText: {
  color: '#000',
  fontSize: 14,
  fontWeight: 'bold',
  marginVertical: 5,
},
termsButton: {
  marginTop: 10,
  alignSelf: 'center',
},
termsButtonText: {
  color: '#0000FF',
  fontSize: 14,
  textDecorationLine: 'underline',
},
currentPlanText: {
  color: '#000',
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 10,
},
});

export default SubScreen;