/* @flow */

import { StyleSheet, Text } from 'react-native';
import React, { Children } from 'react';

const SampleText = (
  {
    children,
  }: {
    children?: Children,
  },
) => <Text style={styles.sampleText}>{children}</Text>;

export default SampleText;

const styles = StyleSheet.create({
  sampleText: {
    margin: 14,
  },
});
