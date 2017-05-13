/* @flow */

import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const logo = require('./assets/NavLogo.png');

const Banner = () => (
  <View style={styles.banner}>
    <Image source={logo} style={styles.image} />
    <Text style={styles.title}>React Navigation Examples with MobX</Text>
  </View>
);

export default Banner;

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#673ab7',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  image: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    tintColor: '#fff',
    margin: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '200',
    color: '#fff',
    margin: 8,
  },
});
