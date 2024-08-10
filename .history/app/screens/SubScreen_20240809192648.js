import React, { useState, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSubscription } from 'src/contexts/SubscriptionContext';
import axios from 'axios';
import { getToken } from '../../auth';
import { BASE_URL } from '@config';
import * as InAppPurchases from 'expo-in-app-purchases';

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
    // Zde budou ID produktů pro Google Play, až je vytvoříte
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

  console.log('SubScreen - Received userId:', userId);

  const plans = [
    { image: require('../../assets/images/freeplan.png'), name: 'Free Plan', isFree: true },
    { image: require('../../assets/images/basicplan.png'), name: 'Basic Plan', isFree: false },
    { image: require('../../assets/images/proplan.png'), name: 'Pro Plan', isFree: false },
    { image: require('../../assets/images/premiumplan.png'), name: 'Premium Plan', isFree: false },
  ];

  useEffect(() => {
    const initializeIAP = async () => {
      try {
        await InAppPurchases.connectAsync();
        // Zde můžete přidat kód pro načtení dostupných produktů, pokud je to potřeba
        // const products = await InAppPurchases.getProductsAsync([...]);
      } catch (error) {
        console.error('Failed to connect to the billing service:', error);
      }
    };

    initializeIAP();

    return () => {
      InAppPurchases.disconnectAsync();
    };
  }, []);

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
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
        setShowCancelButton(true);
        await AsyncStorage.setItem('showCancelButton', 'true');
      } else {
        setShowCancelButton(lastShowCancelButton === 'true');
      }

      await AsyncStorage.setItem('lastSubscription', newSubscription);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
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
              const token = await getToken();
              const response = await axios.post(`${BASE_URL}/subscription/cancel/`, {}, {
                headers: { Authorization: `Token ${token}` }
              });

              Alert.alert('Subscription Cancelled', 'Your subscription has been cancelled and will end at the end of the current billing period.');
              setShowCancelButton(false);
              await AsyncStorage.setItem('showCancelButton', 'false');
              fetchSubscriptionDetails();
            } catch (error) {
              console.error('Error cancelling subscription:', error);
              Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleBuySubscription = async (planType, duration) => {
    try {
      const device = Platform.OS;
      
      // Určení správného produktového ID
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

      // Zahájení nákupu
      const { responseCode, results } = await InAppPurchases.purchaseItemAsync(productId);

      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        // Nákup byl úspěšný, nyní ověřte nákup na serveru
        await verifyPurchase(productId, results[0]);
      } else {
        // Nákup selhal nebo byl zrušen uživatelem
        Alert.alert('Purchase Failed', 'The subscription purchase was not completed.');
      }
    } catch (error) {
      console.error('Error initiating subscription:', error);
      Alert.alert('Error', 'An error occurred while processing your request.');
    }
  };

  const verifyPurchase = async (productId, purchaseResult) => {
    try {
      const token = await getToken();
      const verificationResponse = await axios.post(`${BASE_URL}/verify-purchase/`, {
        product_id: productId,
        receipt: purchaseResult.transactionReceipt,
        transaction_id: purchaseResult.transactionId
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      if (verificationResponse.data.success) {
        Alert.alert('Success', 'Your subscription has been activated!');
        await fetchSubscriptionDetails(); // Aktualizujte informace o předplatném
      } else {
        Alert.alert('Error', 'Failed to verify purchase. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying purchase:', error);
      Alert.alert('Error', 'Failed to verify purchase. Please try again or contact support.');
    }
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
              onPress={() => handleBuySubscription(plan.name, 'monthly')}
            >
              <Text style={styles.orderButtonText}>{`BUY ${plan.name} Monthly`}</Text>
            </TouchableOpacity>
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
        {plans.map((plan, index) => (
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
});

export default SubScreen;