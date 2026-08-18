import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';

const SplashScreen = ({ navigation }: any) => {
  return (
    <ImageBackground
      source={require('../../../assets/splash.png')}
      style={styles.background}
      imageStyle={styles.image}
      resizeMode="cover"
    >

    <View style={styles.content}>
  <Image
    source={require('../../../assets/logo-circle.png')}
    style={styles.logo}
  />

  <Image
  source={require('../../../assets/birds.png')}
  style={styles.birds}
/>

  <Text style={styles.title}>Junior Rangers</Text>
  <Text style={styles.subtitle}>Adventure starts here</Text>
</View>

      {/* Overlay */}
      <View style={styles.overlay}>

        {/* Text */}
        <Text style={styles.text}>
          Explore • Learn • Protect
        </Text>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Welcome')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  image: {
    alignSelf: 'center',
    resizeMode: 'stretch',
  },

    logo: {
  width: 110,
  height: 110,
  marginBottom: 15,
  borderRadius: 60,
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 6,
  },

  birds: {
  position: 'absolute',
  bottom: -390,   // 👈 adjust to sit above the wave
  left: 15,
  width: 100,
  height: 100
  ,
  resizeMode: 'contain',
},

    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        
    },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 130,
  },

  text: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },

    title: {
    fontSize: 40,
    color: '#fff',
    fontWeight: '900',
  letterSpacing: 1.5,

  textShadowColor: '#1B5E20',
  textShadowOffset: { width: 2, height: 3 },
  textShadowRadius: 6,
  },

  subtitle: {
  fontSize: 14,
  color: '#F1F8E9',
  marginTop: 6,
},


  button: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  buttonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16,
  },
});