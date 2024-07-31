import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const AllScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profileImage, setProfileImage] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme(); // Použijte useTheme hook
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
        setProfileImage(response.data.profile_image); // Předpokládáme, že profilová fotka je v response.data.profile_image
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileImage();
  }, [userId]);

  const renderImageWithTouchableOpacity = (imageSource, imageStyle, touchableStyle, pressedKey, containerStyle, targetScreen) => {
    let pressTimer;
  
    return (
      <View style={[styles.imageWrapper, containerStyle]}>
        <Image
          source={imageSource}
          style={[styles.image, imageStyle, pressed[pressedKey] && styles.pressedImage]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, touchableStyle]}
          onPressIn={() => {
            pressTimer = setTimeout(() => setPressed({ ...pressed, [pressedKey]: true }), 70);
          }}
          onPressOut={() => {
            clearTimeout(pressTimer);
            setPressed({ ...pressed, [pressedKey]: false });
          }}
          onPress={() => {
            if (pressed[pressedKey]) {
              navigation.navigate(targetScreen, { userId });  // Zde použijeme targetScreen přímo, bez uvozovek
            }
          }}
        />
      </View>
    );
  };
  

  return (

   

<View style={styles.container}>
    {/* Klasický obrázek, který neslouží jako tlačítko */}
    {profileImage && (
      <Image
        source={{ uri: profileImage }}
        style={{ width: SCREEN_WIDTH * 1, height: SCREEN_HEIGHT * 0.5, position: 'absolute', top: SCREEN_HEIGHT * 0.08, left: SCREEN_WIDTH * 0.010, zIndex: 2 }}
        resizeMode="contain"
      />
    )}
      {/* Klasický obrázek, který neslouží jako tlačítko */}
      <Image
        source={isDarkMode ? require('../../assets/images/square2.png') : require('../../assets/images/square.png')}
        style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.40, position: 'absolute', top: SCREEN_HEIGHT * 0.14, left: SCREEN_WIDTH * 0.12, zIndex: 1 }}
        resizeMode="contain"
      />

      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: 'absolute',
          top: TOGGLE_ICON_TOP,
          right: TOGGLE_ICON_RIGHT,
          zIndex: 3
        }}
      >
        <Image
          source={isDarkMode ? require('../../assets/images/dark.png') : require('../../assets/images/sun.png')}
          style={{
            width: TOGGLE_ICON_SIZE,
            height: TOGGLE_ICON_SIZE
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* První obrázek */}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/alles.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'first',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.50, left: SCREEN_WIDTH * 0.060, zIndex: 1 },
        'UserScreen'
        
      )}
      {/* třeří obrázek */}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'treti',
        { position: 'absolute', top: SCREEN_HEIGHT * -0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 }
      )}
      {/* love obrázek */}
      {renderImageWithTouchableOpacity(
  require('../../assets/images/love.png'),
  { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
  { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 }, // Upraveno
  'loves',
  { position: 'absolute', top: SCREEN_HEIGHT * 0.052, left: SCREEN_WIDTH * 0.88, zIndex: 2 }
  
)}


      {/* subs obrázek */}
      {renderImageWithTouchableOpacity(
  require('../../assets/images/subs.png'),
  { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
  { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 }, // Upraveno
  'subs',
  { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 }
)}

      {/* Obal View s pevnou výškou pro ScrollView */}
      <View style={styles.scrollContainer}>
        {/* Horizontální ScrollView pro další obrázky */}
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContentContainer}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {/* Čtvrtý obrázek */}
          {renderImageWithTouchableOpacity(
  require('../../assets/images/dresso.png'),
  { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.35 },
  { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180 },
  'fourth',
  { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.0095, left: SCREEN_WIDTH * -0.17 },
  'DressScreen'  // Přidána čárka před tímto argumentem
)}

          {/* Pátý obrázek */}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/topps.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.345 },
             { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'fifth',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.015, left: SCREEN_WIDTH * -0.17 },
            'TopScreen'
          )}
           
           {/* šestý obrázek */}
           {renderImageWithTouchableOpacity(
            require('../../assets/images/jeanns.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.370 },
             { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'sixth',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.026, left: SCREEN_WIDTH * -0.17 },
            'JeansScreen'
          )}
           {/* sedmý obrázek */}
           {renderImageWithTouchableOpacity(
            require('../../assets/images/jumpsuit.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.337 },
             { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'seventh',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.027, left: SCREEN_WIDTH * -0.17 },
            'JumpsuitScreen'
          )}
           {/* osmý obrázek */}
           {renderImageWithTouchableOpacity(
            require('../../assets/images/shorts.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.370 },
             { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'eight',
            { marginRight: SCREEN_WIDTH * -0.29, marginTop: SCREEN_HEIGHT * 0.026, left: SCREEN_WIDTH * -0.17 },
            'ShortScreen'
          )}
            {/* devátý obrázek */}
            {renderImageWithTouchableOpacity(
            require('../../assets/images/jacket.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.324 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180,},
            'night',
            { marginRight: SCREEN_WIDTH * -0.31, marginTop: SCREEN_HEIGHT * 0.038, left: SCREEN_WIDTH * -0.17 },
            'JacketScreen'
          )}
          {/* desátý obrázek */}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/sweatpants.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.368 },
             { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'ten',
            { marginRight: SCREEN_WIDTH * -0.28, marginTop: SCREEN_HEIGHT * 0.026, left: SCREEN_WIDTH * -0.17 },
            'SweatpantsScreen'
          )}
           {/* jedenáct obrázek */}
           {renderImageWithTouchableOpacity(
            require('../../assets/images/skirts.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.368 },
             { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'eleven',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.028, left: SCREEN_WIDTH * -0.17 },
            'SkirtScreen'
          )}
           {/* dvanáct obrázek */}
           {renderImageWithTouchableOpacity(
            require('../../assets/images/sweater.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.336 },
             { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'twelve',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.028, left: SCREEN_WIDTH * -0.17 },
            'SweaterScreen'
          )}
          {/* třináct obrázek */}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/pants.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.368 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'thirtheen',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.028, left: SCREEN_WIDTH * -0.17 },
            'PantsScreen'
          )}
          {/* čtrnáct obrázek */}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/leggins.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.368 },
            { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'fourtheen',
            { marginRight: SCREEN_WIDTH * -0.28, marginTop: SCREEN_HEIGHT * 0.028, left: SCREEN_WIDTH * -0.17 },
            'LeggingsScreen'
          )}
          {/* pantáct obrázek */}
          {renderImageWithTouchableOpacity(
            require('../../assets/images/coat.png'),
            { width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT * 0.337 },
             { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.250, top: SCREEN_HEIGHT * 0.070, left: SCREEN_WIDTH * 0.180, },
            'fifthteen',
            { marginRight: SCREEN_WIDTH * -0.30, marginTop: SCREEN_HEIGHT * 0.027, left: SCREEN_WIDTH * -0.17 }
          )}


          {/* Prázdný View pro umožnění scrollování za poslední obrázek */}
          <View style={{ width: SCREEN_WIDTH * 0.2 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04011A',
  },
  scrollContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.03,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    // Základní styl pro obrázky
  },
  pressedImage: {
    opacity: 0.5,
  },
  button: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

export default AllScreen;
