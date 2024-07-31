import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSubscription } from 'src/contexts/SubscriptionContext';
import axios from 'axios';
import { getToken } from '../../auth'; // Ujistěte se, že máte tuto funkci pro získání tokenu

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BUTTONS_BOTTOM_OFFSET = SCREEN_HEIGHT * -0.08;

const BUTTON_CONFIG = {
  width: SCREEN_WIDTH * 0.5,
  height: SCREEN_HEIGHT * 0.04,
  marginVertical: SCREEN_HEIGHT * 0.01,
};

const SubScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;
  const { virtualTryOnsRemaining, updateSubscriptionLimits } = useSubscription();
  const [userSubscription, setUserSubscription] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);

  console.log('SubScreen - Received userId:', userId);

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://192.168.0.106:8000/subscription/details/', {
        headers: { Authorization: `Token ${token}` }
      });
      setUserSubscription(response.data.subscription_type);
      setIsCancelled(response.data.is_cancelled); // Přidána kontrola stavu zrušení
      updateSubscriptionLimits(response.data);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
    }
  }, [updateSubscriptionLimits]);

  useFocusEffect(
    useCallback(() => {
      fetchSubscriptionDetails();
    }, [fetchSubscriptionDetails])
  );

  const plans = [
    { image: require('../../assets/images/freeplan.png'), name: 'Free Plan', isFree: true },
    { image: require('../../assets/images/basicplan.png'), name: 'Basic Plan', isFree: false },
    { image: require('../../assets/images/proplan.png'), name: 'Pro Plan', isFree: false },
    { image: require('../../assets/images/premiumplan.png'), name: 'Premium Plan', isFree: false },
  ];

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
      'Confirm Cancellation',
      'Are you sure you want to cancel your subscription? You will lose all premium features at the end of the current billing period.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: confirmCancelSubscription }
      ]
    );
  };

  const confirmCancelSubscription = async () => {
    try {
      const token = await getToken();
      const response = await axios.post('http://192.168.0.106:8000/subscription/cancel/', {}, {
        headers: { Authorization: `Token ${token}` }
      });

      Alert.alert('Subscription Cancelled', response.data.message);
      setIsCancelled(true);
      updateSubscriptionLimits(response.data.subscription_details);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
    }
  };

  const renderButtons = (plan) => {
    const isCurrentPlan = plan.name.toLowerCase().replace(' plan', '') === userSubscription;

    return (
      <View style={[styles.buttonsContainer, { bottom: BUTTONS_BOTTOM_OFFSET }]}>
        {isCurrentPlan ? (
          <>
            <Text style={styles.tryOnsText}>TRY ONS Remaining: {virtualTryOnsRemaining}</Text>
            {!plan.isFree && !isCancelled && (
              <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#FF0000', marginTop: 10 }]} onPress={handleCancelSubscription}>
                <Text style={styles.orderButtonText}>Cancel Subscription</Text>
              </TouchableOpacity>
            )}
            {!plan.isFree && isCancelled && (
              <>
                <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#000' }]}>
                  <Text style={styles.orderButtonText}>BUY MONTH</Text>
                </TouchableOpacity>
                <Text style={styles.discountText}>20% discount on yearly plan</Text>
                <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#000' }]}>
                  <Text style={styles.orderButtonText}>BUY YEAR</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        ) : (
          !plan.isFree && (
            <>
              <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#000' }]}>
                <Text style={styles.orderButtonText}>BUY MONTH</Text>
              </TouchableOpacity>
              <Text style={styles.discountText}>20% discount on yearly plan</Text>
              <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#000' }]}>
                <Text style={styles.orderButtonText}>BUY YEAR</Text>
              </TouchableOpacity>
            </>
          )
        )}
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
        {plans.map((plan, index) => (
          <View key={index} style={styles.planWrapper}>
            <Image
              source={plan.image}
              style={styles.planImage}
              resizeMode="contain"
            />
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
    top: SCREEN_HEIGHT * 0.12,
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
    top: SCREEN_HEIGHT * -0.01,
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
