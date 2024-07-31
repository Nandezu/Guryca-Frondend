import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { useProfile } from '../../ProfileProvider';
import { getToken } from '@/auth';

const { width: SIRKA_OBRAZOVKY, height: VYSKA_OBRAZOVKY } = Dimensions.get('window');

const POZICE_IKONY_NAHORE = VYSKA_OBRAZOVKY * 0.155;
const POZICE_IKONY_VPRAVO = SIRKA_OBRAZOVKY * 0.23;
const VELIKOST_IKONY = SIRKA_OBRAZOVKY * 0.06;

const SIRKA_KONTEJNERU = SIRKA_OBRAZOVKY * 0.55;
const VYSKA_KONTEJNERU = SIRKA_KONTEJNERU * 1.6;

const AllScreen = () => {
  const [stisknuto, setStisknuto] = useState({ prvni: false, druhe: false, treti: false, ctvrte: false, pate: false });
  const [profilovyObrazek, setProfilovyObrazek] = useState(null);
  const { jeTmavyRezim, prepnoutTema } = useTheme();
  const navigace = useNavigation();
  const trasa = useRoute();
  const { idUzivatele } = trasa.params;

  const refFlatListu = useRef(null);
  const { profily, nastavitProfily, indexVybranehoProfilu, nastavitIndexVybranehoProfilu } = useProfile();

  useEffect(() => {
    const nacistData = async () => {
      try {
        const profilovyObrazek = await nacistProfilovyObrazek();
        const vysledkyVyzkouseni = await nacistVysledkyVyzkouseni(profilovyObrazek);
        nastavitProfily(vysledkyVyzkouseni);
      } catch (chyba) {
        console.error("Chyba při načítání dat:", chyba);
      }
    };

    if (idUzivatele) {
      nacistData();
    }
  }, [idUzivatele, nastavitProfily]);

  const nacistProfilovyObrazek = async () => {
    try {
      const tokenUzivatele = await getToken();
      if (!tokenUzivatele) throw new Error('Uživatel není autentizován');

      const odpoved = await axios.get(`http://192.168.0.106:8000/user/users/${idUzivatele}/`, {
        headers: { 'Authorization': `Token ${tokenUzivatele}` }
      });
      const profiloveObrazky = odpoved.data.profile_images;
      const urlAktivnihoObrazku = profiloveObrazky && profiloveObrazky.length > 0 ? profiloveObrazky[0] : null;
      setProfilovyObrazek(urlAktivnihoObrazku);
      return urlAktivnihoObrazku;
    } catch (chyba) {
      console.error('Chyba při načítání profilového obrázku:', chyba);
      return null;
    }
  };

  const nacistVysledkyVyzkouseni = async (profilovyObrazek) => {
    try {
      const tokenUzivatele = await getToken();
      if (!tokenUzivatele) throw new Error('Uživatel není autentizován');

      const odpoved = await axios.get(`http://192.168.0.106:8000/tryon/results/`, {
        headers: { 'Authorization': `Token ${tokenUzivatele}` }
      });

      const vysledky = [
        { id: 'profil', urlObrazku: profilovyObrazek },
        ...odpoved.data.map(polozka => ({ id: polozka.id, urlObrazku: polozka.result_image }))
      ];

      return vysledky;
    } catch (chyba) {
      console.error('Chyba při načítání výsledků vyzkoušení:', chyba);
      return [{ id: 'profil', urlObrazku: profilovyObrazek || null }];
    }
  };

  const zpracovatPosun = (udalost) => {
    const posunObsahu = udalost.nativeEvent.contentOffset.x;
    const index = Math.round(posunObsahu / SIRKA_OBRAZOVKY);
    nastavitIndexVybranehoProfilu(index);
  };

  const vykresliPolozkyProfilu = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (index !== 0 && item.id !== 'profil') {
            nastavitIndexVybranehoProfilu(index);
            navigace.navigate('ObrazovkaDetailuObrazku', {
              urlObrazku: item.urlObrazku,
              indexProfilu: index,
              idPolozky: item.id,
              idUzivatele: idUzivatele
            });
          }
        }}
        disabled={index === 0 || item.id === 'profil'}
        delayPressIn={100}
        delayPressOut={100}
        delayLongPress={200}
      >
        <View style={styly.kontejnerPolozkyProfilu}>
          {item.urlObrazku ? (
            <Image
              source={{ uri: item.urlObrazku }}
              style={[styly.profilovyObrazek, index > 0 && styly.transformovanyProfilovyObrazek]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styly.profilovyObrazek, { backgroundColor: 'gray' }]} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const vykresliObrazekSTlacitkem = (zdrojObrazku, stylObrazku, stylTlacitka, klicStisknuti, stylKontejneru, cilovaObrazovka) => {
    let casovacStisku;

    return (
      <View style={[styly.obalObrazku, stylKontejneru]}>
        <Image
          source={zdrojObrazku}
          style={[styly.obrazek, stylObrazku, stisknuto[klicStisknuti] && styly.stisknutyObrazek]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styly.tlacitko, stylTlacitka]}
          onPressIn={() => {
            casovacStisku = setTimeout(() => setStisknuto({ ...stisknuto, [klicStisknuti]: true }), 70);
          }}
          onPressOut={() => {
            clearTimeout(casovacStisku);
            setStisknuto({ ...stisknuto, [klicStisknuti]: false });
          }}
          onPress={() => {
            if (stisknuto[klicStisknuti]) {
              navigace.navigate(cilovaObrazovka, { idUzivatele });
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={styly.kontejner}>
      {profilovyObrazek && (
        <FlatList
          ref={refFlatListu}
          data={profily}
          renderItem={vykresliPolozkyProfilu}
          extraData={indexVybranehoProfilu}
          keyExtractor={(polozka, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={zpracovatPosun}
          style={styly.kontejnerScrolluProfilu}
          getItemLayout={(data, index) => ({
            length: SIRKA_OBRAZOVKY,
            offset: SIRKA_OBRAZOVKY * index,
            index,
          })}
          initialScrollIndex={indexVybranehoProfilu}
          onScrollToIndexFailed={() => {}}
        />
      )}

      {/* Klasický obrázek, který neslouží jako tlačítko */}
      <Image
        source={jeTmavyRezim ? require('../../assets/images/square2.png') : require('../../assets/images/square.png')}
        style={{ width: SIRKA_OBRAZOVKY * 0.8, height: VYSKA_OBRAZOVKY * 0.40, position: 'absolute', top: VYSKA_OBRAZOVKY * 0.14, left: SIRKA_OBRAZOVKY * 0.12, zIndex: 1 }}
        resizeMode="contain"
      />

      <TouchableOpacity
        onPress={prepnoutTema}
        style={{
          position: 'absolute',
          top: POZICE_IKONY_NAHORE,
          right: POZICE_IKONY_VPRAVO,
          zIndex: 3
        }}
      >
        <Image
          source={jeTmavyRezim ? require('../../assets/images/dark.png') : require('../../assets/images/sun.png')}
          style={{
            width: VELIKOST_IKONY,
            height: VELIKOST_IKONY
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* První obrázek */}
      {vykresliObrazekSTlacitkem(
        require('../../assets/images/alles.png'),
        { width: SIRKA_OBRAZOVKY * 0.6, height: VYSKA_OBRAZOVKY * 0.2 },
        { width: SIRKA_OBRAZOVKY * 0.6, height: VYSKA_OBRAZOVKY * 0.2, top: VYSKA_OBRAZOVKY * 0.025, left: SIRKA_OBRAZOVKY * 0.1 },
        'prvni',
        { position: 'absolute', top: VYSKA_OBRAZOVKY * 0.49, left: SIRKA_OBRAZOVKY * 0.060, zIndex: 1 },
        'UserScreen'
      )}

      {/* Třetí obrázek */}
      {vykresliObrazekSTlacitkem(
        require('../../assets/images/nandezu.png'),
        { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.16 },
        { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.16, top: VYSKA_OBRAZOVKY * 0.025, left: SIRKA_OBRAZOVKY * 0.1 },
        'treti',
        { position: 'absolute', top: VYSKA_OBRAZOVKY * -0.01, left: SIRKA_OBRAZOVKY * 0.330, zIndex: 2 }
      )}

      {/* Love obrázek */}
      {vykresliObrazekSTlacitkem(
        require('../../assets/images/love.png'),
        { width: SIRKA_OBRAZOVKY * 0.07, height: VYSKA_OBRAZOVKY * 0.035 },
        { width: SIRKA_OBRAZOVKY * 0.07, height: VYSKA_OBRAZOVKY * 0.035 },
        'loves',
        { position: 'absolute', top: VYSKA_OBRAZOVKY * 0.052, left: SIRKA_OBRAZOVKY * 0.88, zIndex: 2 }
      )}

      {/* Subs obrázek */}
      {vykresliObrazekSTlacitkem(
        require('../../assets/images/subs.png'),
        { width: SIRKA_OBRAZOVKY * 0.08, height: VYSKA_OBRAZOVKY * 0.04 },
        { width: SIRKA_OBRAZOVKY * 0.08, height: VYSKA_OBRAZOVKY * 0.04 },
        'subs',
        { position: 'absolute', top: VYSKA_OBRAZOVKY * 0.050, left: SIRKA_OBRAZOVKY * 0.050, zIndex: 2 }
      )}

      {/* Obal View s pevnou výškou pro ScrollView */}
      <View style={styly.kontejnerScrollu}>
        {/* Horizontální ScrollView pro další obrázky */}
        <ScrollView
          horizontal
          contentContainerStyle={styly.obsahKontejneruScrollu}
          showsHorizontalScrollIndicator={false}
          style={styly.scrollView}
        >
          {/* Čtvrtý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/dresso.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.35 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'ctvrte',
            { marginRight: SIRKA_OBRAZOVKY * -0.30, marginTop: VYSKA_OBRAZOVKY * 0.0095, left: SIRKA_OBRAZOVKY * -0.17 },
            'DressScreen'
          )}

          {/* Pátý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/topps.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.345 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'pate',
            { marginRight: SIRKA_OBRAZOVKY * -0.30, marginTop: VYSKA_OBRAZOVKY * 0.015, left: SIRKA_OBRAZOVKY * -0.17 },
            'TopScreen'
          )}

          {/* Šestý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/jeanns.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.370 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'seste',
            { marginRight: SIRKA_OBRAZOVKY * -0.30, marginTop: VYSKA_OBRAZOVKY * 0.026, left: SIRKA_OBRAZOVKY * -0.17 },
            'JeansScreen'
          )}

          {/* Sedmý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/jumpsuit.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.337 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'sedme',
            { marginRight: SIRKA_OBRAZOVKY * -0.30, marginTop: VYSKA_OBRAZOVKY * 0.027, left: SIRKA_OBRAZOVKY * -0.17 },
            'JumpsuitScreen'
          )}

          {/* Osmý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/shorts.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.370 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'osme',
            { marginRight: SIRKA_OBRAZOVKY * -0.29, marginTop: VYSKA_OBRAZOVKY * 0.026, left: SIRKA_OBRAZOVKY * -0.17 },
            'ShortScreen'
          )}

          {/* Devátý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/jacket.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.324 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'devate',
            { marginRight: SIRKA_OBRAZOVKY * -0.31, marginTop: VYSKA_OBRAZOVKY * 0.038, left: SIRKA_OBRAZOVKY * -0.17 },
            'JacketScreen'
          )}

          {/* Desátý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/sweatpants.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.368 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'desate',
            { marginRight: SIRKA_OBRAZOVKY * -0.28, marginTop: VYSKA_OBRAZOVKY * 0.026, left: SIRKA_OBRAZOVKY * -0.17 },
            'SweatpantsScreen'
          )}

          {/* Jedenáctý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/skirts.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.368 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'jedenacte',
            { marginRight: SIRKA_OBRAZOVKY * -0.30, marginTop: VYSKA_OBRAZOVKY * 0.028, left: SIRKA_OBRAZOVKY * -0.17 },
            'SkirtScreen'
          )}

          {/* Dvanáctý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/sweater.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.336 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'dvanacte',
            { marginRight: SIRKA_OBRAZOVKY * -0.30, marginTop: VYSKA_OBRAZOVKY * 0.028, left: SIRKA_OBRAZOVKY * -0.17 },
            'SweaterScreen'
          )}

          {/* Třináctý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/pants.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.368 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'trinacte',
            { marginRight: SIRKA_OBRAZOVKY * -0.30, marginTop: VYSKA_OBRAZOVKY * 0.028, left: SIRKA_OBRAZOVKY * -0.17 },
            'PantsScreen'
          )}

          {/* Čtrnáctý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/leggins.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.368 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'ctrnacte',
            { marginRight: SIRKA_OBRAZOVKY * -0.28, marginTop: VYSKA_OBRAZOVKY * 0.028, left: SIRKA_OBRAZOVKY * -0.17 },
            'LeggingsScreen'
          )}

          {/* Patnáctý obrázek */}
          {vykresliObrazekSTlacitkem(
            require('../../assets/images/coat.png'),
            { width: SIRKA_OBRAZOVKY * 0.75, height: VYSKA_OBRAZOVKY * 0.337 },
            { width: SIRKA_OBRAZOVKY * 0.35, height: VYSKA_OBRAZOVKY * 0.250, top: VYSKA_OBRAZOVKY * 0.070, left: SIRKA_OBRAZOVKY * 0.180 },
            'patnacte',
            { marginRight: SIRKA_OBRAZOVKY * -0.30, marginTop: VYSKA_OBRAZOVKY * 0.027, left: SIRKA_OBRAZOVKY * -0.17 },
            'CoatScreen'
          )}

          {/* Prázdný View pro umožnění scrollování za poslední obrázek */}
          <View style={{ width: SIRKA_OBRAZOVKY * 0.2 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#04011A',
  },
  kontejnerScrollu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: VYSKA_OBRAZOVKY * 0.44,
  },
  scrollView: {
    flex: 1,
  },
  obsahKontejneruScrollu: {
    paddingHorizontal: SIRKA_OBRAZOVKY * 0.05,
    paddingVertical: VYSKA_OBRAZOVKY * 0.03,
  },
  obalObrazku: {
    position: 'relative',
  },
  obrazek: {
    // Základní styl pro obrázky
  },
  stisknutyObrazek: {
    opacity: 0.5,
  },
  tlacitko: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  kontejnerScrolluProfilu: {
    position: 'absolute',
    top: VYSKA_OBRAZOVKY * 0.12,
    left: SIRKA_OBRAZOVKY * 0.010,
    width: SIRKA_OBRAZOVKY,
    height: VYSKA_KONTEJNERU,
    zIndex: 2,
  },
  kontejnerPolozkyProfilu: {
    width: SIRKA_OBRAZOVKY,
    height: VYSKA_KONTEJNERU,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilovyObrazek: {
    width: SIRKA_KONTEJNERU,
    height: VYSKA_KONTEJNERU,
    borderRadius: 20,
  },
  transformovanyProfilovyObrazek: {
    transform: [{ scaleX: 0.87 }],
  },
});

export default AllScreen;