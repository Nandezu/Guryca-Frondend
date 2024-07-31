import React, { useState, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSubscription } from 'src/contexts/SubscriptionContext';
import axios from 'axios';
import { getToken } from '../../auth';

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
  const [showCancelButton, setShowCancelButton] = useState(true);

  console.log('SubScreen - Received userId:', userId);

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://192.168.0.106:8000/subscription/details/', {
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

  const handleCancelSubscription = async () => {
    try {
      const token = await getToken();
      const response = await axios.post('http://192.168.0.106:8000/subscription/cancel/', {}, {
        headers: { Authorization: `Token ${token}` }
      });

      Alert.alert('Subscription Cancellation', response.data.message);
      setShowCancelButton(false);
      await AsyncStorage.setItem('showCancelButton', 'false');
      fetchSubscriptionDetails();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
    }
  };

  const renderButtons = (plan) => {
    const isCurrentPlan = plan.name.toLowerCase().replace(' plan', '') === userSubscription;

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