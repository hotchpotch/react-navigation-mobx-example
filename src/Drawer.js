/**
 * @flow
 */

import { Button, Platform, ScrollView, StyleSheet } from 'react-native';
import {
  DrawerNavigator,
} from 'react-navigation';
import { inject } from 'mobx-react/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

import SampleText from './SampleText';

const MyNavScreen = inject('nav')(({ nav, banner }) => (
  <ScrollView style={styles.container}>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => nav.navigate('DrawerOpen')}
      title="Open drawer"
    />
    <Button
      onPress={() => nav.goBack(null)}
      title="Go back"
    />
  </ScrollView>
));

const InboxScreen = () => (
  <MyNavScreen
    banner={'Inbox Screen'}
  />
);
InboxScreen.navigationOptions = {
  drawer: {
    label: 'Inbox',
    icon: ({ tintColor }) => (
      <MaterialIcons
        name="move-to-inbox"
        size={24}
        style={{ color: tintColor }}
      />
    ),
  },
};

const DraftsScreen = () => (
  <MyNavScreen
    banner={'Drafts Screen'}
  />
);
DraftsScreen.navigationOptions = {
  drawer: {
    label: 'Drafts',
    icon: ({ tintColor }) => (
      <MaterialIcons
        name="drafts"
        size={24}
        style={{ color: tintColor }}
      />
    ),
  },
};

const DrawerExample = DrawerNavigator({
  Inbox: {
    path: '/',
    screen: InboxScreen,
  },
  Drafts: {
    path: '/sent',
    screen: DraftsScreen,
  },
}, {
  initialRouteName: 'Drafts',
  contentOptions: {
    activeTintColor: '#e91e63',
  },
});

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

export default DrawerExample;
