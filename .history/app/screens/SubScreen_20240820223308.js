import React, { useState, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSubscription } from 'src/contexts/SubscriptionContext';
import axios from 'axios';
import { getToken } from '../../auth';
import { BASE_URL } from '@config';
import * as RNIap from 'react-native-iap';
import * as Sentry from 'sentry-expo';

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

  useEffect(() => {
    const transaction = Sentry.startTransaction({ name: "SubScreen" });

    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `SubScreen - Received userId: ${userId}`,
      level: 'info',
    });

    const initializeIAP = async () => {
      try {
        Sentry.addBreadcrumb({
          category: 'iap',
          message: 'Initializing RNIap...',
          level: 'info',
        });
        await RNIap.initConnection();
        Sentry.addBreadcrumb({
          category: 'iap',
          message: 'RNIap connection initialized successfully',
          level: 'info',
        });

        const productIds = Platform.OS === 'ios' 
          ? Object.values(SUBSCRIPTION_PRODUCTS.iOS)
          : Object.values(SUBSCRIPTION_PRODUCTS.android);
        Sentry.addBreadcrumb({
          category: 'iap',
          message: `Fetching subscriptions for product IDs: ${productIds.join(', ')}`,
          level: 'info',
        });

        const products = await RNIap.getSubscriptions(productIds);
        Sentry.addBreadcrumb({
          category: 'iap',
          message: `Found ${products.length} products`,
          level: 'info',
        });

        if (products.length === 0) {
          Sentry.addBreadcrumb({
            category: 'iap',
            message: 'No products found. Check your product IDs and Google Play Console setup.',
            level: 'warning',
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error('Failed to initialize IAP:', error);
      }
    };

    initializeIAP();
    fetchAvailablePlans();

    return () => {
      Sentry.addBreadcrumb({
        category: 'iap',
        message: 'Ending RNIap connection',
        level: 'info',
      });
      RNIap.endConnection();
      transaction.finish();
    };
  }, []);

  const planImages = {
    'Free Plan': require('../../assets/images/freeplan.png'),
    'Basic Plan': require('../../assets/images/basicplan.png'),
    'Pro Plan': require('../../assets/images/proplan.png'),
    'Premium Plan': require('../../assets/images/premiumplan.png'),
  };

  const fetchAvailablePlans = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/subscription/plans/`, {
        headers: { Authorization: `Token ${token}` }
      });
      const plansWithImages = response.data.map(plan => ({
        ...plan,
        image: planImages[plan.name],
        isFree: plan.name === 'Free Plan'
      })).filter(plan => plan.image !== undefined);
      setAvailablePlans(plansWithImages);
    } catch (error) {
      Sentry.captureException(error);
      handleError(error, 'Failed to fetch available plans');
    }
  };

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/subscription/details/`, {
        headers: { Authorization: `Token ${token}` }
      });
      
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: 'Fetched subscription details',
        data: response.data,
        level: 'info',
      });
      
      const newSubscription = response.data.subscription_type;
      setUserSubscription(newSubscription);
      setIsCancelled(response.data.is_cancelled);
      updateSubscriptionLimits(response.data);

      const lastSubscription = await AsyncStorage.getItem('lastSubscription');
      const lastShowCancelButton = await AsyncStorage.getItem('showCancelButton');

      if (lastSubscription !== newSubscription) {
        setShowCancelButton(true);
        await AsyncStorage.setItem('showCancelButton', 'true');
      } else {
        setShowCancelButton(lastShowCancelButton === 'true');
      }

      await AsyncStorage.setItem('lastSubscription', newSubscription);
    } catch (error) {
      Sentry.captureException(error);
      handleError(error, 'Error fetching subscription details');
    }
  }, [updateSubscriptionLimits]);

  useFocusEffect(
    useCallback(() => {
      fetchSubscriptionDetails();
    }, [fetchSubscriptionDetails])
  );

  const handleNandezuPress = () => {
    if (userId) {
      navigation.navigate('UserScreen', { userId: userId });
    } else {
      Sentry.captureMessage('userId is undefined in SubScreen');
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
          onPress: () => Sentry.addBreadcrumb({
            category: 'subscription',
            message: 'Cancel Subscription Cancelled',
            level: 'info',
          }),
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel Subscription',
          onPress: async () => {
            try {
              const token = await getToken();
              const response = await axios.post(`${BASE_URL}/subscription/cancel/`, {}, {
                headers: { Authorization: `Token ${token}` }
              });

              Alert.alert('Subscription Cancelled', 'Your subscription has been cancelled and will end at the end of the current billing period.');
              setShowCancelButton(false);
              await AsyncStorage.setItem('showCancelButton', 'false');
              fetchSubscriptionDetails();
              Sentry.addBreadcrumb({
                category: 'subscription',
                message: 'Subscription cancelled successfully',
                level: 'info',
              });
            } catch (error) {
              Sentry.captureException(error);
              handleError(error, 'Failed to cancel subscription');
            }
          }
        }
      ]
    );
  };

  const handleBuySubscription = async (planType, duration) => {
    try {
      const device = Platform.OS;
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: `Attempting to buy subscription: ${planType} - ${duration} on ${device}`,
        level: 'info',
      });
      
      let productId;
      const productPlatform = device === 'ios' ? SUBSCRIPTION_PRODUCTS.iOS : SUBSCRIPTION_PRODUCTS.android;
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
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: `Selected product ID: ${productId}`,
        level: 'info',
      });

      // Získání detailů předplatného
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: 'Getting subscription details...',
        level: 'info',
      });
      const subscriptions = await RNIap.getSubscriptions([productId]);
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: `Found ${subscriptions.length} subscriptions`,
        level: 'info',
      });

      if (subscriptions.length === 0) {
        throw new Error('No subscriptions available');
      }

      const subscription = subscriptions[0];
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: `Subscription offers: ${JSON.stringify(subscription.subscriptionOfferDetails)}`,
        level: 'info',
      });

      if (!subscription.subscriptionOfferDetails || subscription.subscriptionOfferDetails.length === 0) {
        throw new Error('No subscription offers available');
      }

      const offerToken = subscription.subscriptionOfferDetails[0].offerToken;
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: `Using offer token: ${offerToken}`,
        level: 'info',
      });

      Sentry.addBreadcrumb({
        category: 'subscription',
        message: 'Requesting subscription...',
        level: 'info',
      });
      const purchase = await RNIap.requestSubscription({
        sku: productId,
        subscriptionOffers: [{ sku: productId, offerToken: offerToken }],
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

      Sentry.addBreadcrumb({
        category: 'subscription',
        message: 'Purchase completed',
        level: 'info',
      });

      if (purchase) {
        Sentry.addBreadcrumb({
          category: 'subscription',
          message: 'Verifying purchase...',
          level: 'info',
        });
        await verifyPurchase(productId, purchase);
        
        if (Platform.OS === 'ios') {
          Sentry.addBreadcrumb({
            category: 'subscription',
            message: 'Finishing iOS transaction...',
            level: 'info',
          });
          await RNIap.finishTransactionIOS(purchase.transactionId);
        } else {
          Sentry.addBreadcrumb({
            category: 'subscription',
            message: 'Acknowledging Android purchase...',
            level: 'info',
          });
          await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
        }
      } else {
        Sentry.addBreadcrumb({
          category: 'subscription',
          message: 'Purchase was not completed.',
          level: 'warning',
        });
        Alert.alert('Purchase Failed', 'The subscription purchase was not completed.');
      }
    } catch (error) {
      Sentry.captureException(error);
      if (error.code !== 'E_USER_CANCELLED') {
        handleError(error, 'An error occurred while processing your request');
      }
    }
  };

  const verifyPurchase = async (productId, purchase) => {
    try {
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: 'Verifying purchase on backend...',
        level: 'info',
      });
      const token = await getToken();
      const verificationResponse = await axios.post(`${BASE_URL}/verify-purchase/`, {
        product_id: productId,
        receipt: purchase.transactionReceipt,
        transaction_id: purchase.transactionId,
        is_ios: Platform.OS === 'ios'
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      Sentry.addBreadcrumb({
        category: 'subscription',
        message: 'Received verification response',
        data: verificationResponse.data,
        level: 'info',
      });

      if (verificationResponse.data.success) {
        Sentry.addBreadcrumb({
          category: 'subscription',
          message: 'Purchase verified successfully',
          level: 'info',
        });
        Alert.alert('Success', 'Your subscription has been activated!');
        await fetchSubscriptionDetails();
      } else {
        throw new Error('Failed to verify purchase');
      }
    } catch (error) {
      Sentry.captureException(error);
      handleError(error, 'Failed to verify purchase. Please try again or contact support.');
    }
  };

  const handleChangeSubscription = async (newPlanType, duration) => {
    try {
      const token = await getToken();
      const response = await axios.post(`${BASE_URL}/subscription/change/`, {
        new_product_id: getProductId(newPlanType, duration),
        is_ios: Platform.OS === 'ios'
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      if (response.data.success) {
        Alert.alert('Success', 'Your subscription has been changed successfully!');
        await fetchSubscriptionDetails();
        Sentry.addBreadcrumb({
          category: 'subscription',
          message: 'Subscription changed successfully',
          level: 'info',
        });
      } else {
        throw new Error('Failed to change subscription');
      }
    } catch (error) {
      Sentry.captureException(error);
      handleError(error, 'An error occurred while changing your subscription');
    }
  };

  const getProductId = (planType, duration) => {
    const productPlatform = Platform.OS === 'ios' ? SUBSCRIPTION_PRODUCTS.iOS : SUBSCRIPTION_PRODUCTS.android;
    switch (planType.toLowerCase()) {
      case 'basic plan':
        return duration === 'monthly' ? productPlatform.BASIC_MONTHLY : productPlatform.BASIC_ANNUAL;
      case 'pro plan':
        return duration === 'monthly' ? productPlatform.PRO_MONTHLY : productPlatform.PRO_ANNUAL;
      case 'premium plan':
        return duration === 'monthly' ? productPlatform.PREMIUM_MONTHLY : productPlatform.PREMIUM_ANNUAL;
      default:
        throw new Error('Invalid plan type');
    }
  };

  const handleError = (error, defaultMessage) => {
    Sentry.captureException(error);
    console.error('Error occurred:', error);
    const errorMessage = error.response?.data?.error || error.message || defaultMessage;
    Alert.alert('Error', errorMessage);
  };

  const isCurrentOrAnnualPlan = (planName) => {
    if (!userSubscription) return false;
    const currentPlanBase = userSubscription.replace('_annual', '');
    const planNameBase = planName.toLowerCase().replace(' plan', '');
    return currentPlanBase === planNameBase;
  };

  const renderButtons = (plan) => {
    const isCurrentPlan = isCurrentOrAnnualPlan(plan.name);

    return (
      <View style={[styles.buttonsContainer, { bottom: BUTTONS_BOTTOM_OFFSET }]}>
        {isCurrentPlan && (
          <Text style={styles.tryOnsText}>TRY ONS Remaining: {virtualTryOnsRemaining}</Text>
        )}
        {isCurrentPlan && !plan.isFree && showCancelButton && !isCancelled && (
          <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#FF0000', marginTop: 10 }]} onPress={handleCancelSubscription}>
            <Text style={styles.orderButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        )}
        {!isCurrentPlan && !plan.isFree && (
          <>
            <TouchableOpacity
              style={[styles.orderButton, { backgroundColor: '#000' }]}
              onPress={() => handleBuySubscription(plan.name, 'annual')}
            >
              <Text style={styles.orderButtonText}>{`BUY ${plan.name} Annual`}</Text>
            </TouchableOpacity>
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
      <Image
        source={plan.image}
        style={imageStyle}
        resizeMode="contain"
      />
    );
  };

  return (
    <Sentry.ErrorBoundary fallback={({ error }) => (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>An error occurred: {error.message}</Text>
      </View>
    )}>
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
    </Sentry.ErrorBoundary>
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
    width: SCREEN_WIDTH * 1,
    height: SCREEN_HEIGHT * 0.6,
    marginTop: SCREEN_HEIGHT * 0.05,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CFD6DE',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SubScreen;