/**
 * @flow
 */

import { Button, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { inject } from 'mobx-react/native';
import React from 'react';

import SampleText from './SampleText';

const MyNavScreen = inject('nav')(({ banner, nav }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => nav.navigate('Profile', { name: 'Jane', mode: 'edit' })}
      title="Go to a profile screen"
    />
    <Button
      onPress={() => nav.navigate('Photos', { name: 'Jane' })}
      title="Go to a photos screen"
    />
    <Button onPress={() => nav.goBack(null)} title="Go back" />
  </ScrollView>
));

const MyHomeScreen = () => <MyNavScreen banner="Home Screen" />;
MyHomeScreen.navigationOptions = {
  title: 'Welcome',
};

const MyPhotosScreen = inject('nav')(({ nav }) => (
  <MyNavScreen banner={`${nav.state.params.name}'s Photos`} />
));

MyPhotosScreen.navigationOptions = {
  title: 'Photos',
};

const MyProfileScreen = inject('nav')(({ nav }) => (
  <MyNavScreen
    banner={`${nav.state.params.mode === 'edit' ? 'Now Editing ' : ''}${nav.state.params.name}'s Profile`}
  />
));
MyProfileScreen.navigationOptions = ({ navigation }) => {
  const { state, setParams } = navigation;
  return {
    title: `${state.params.name}'s Profile!`,
    // Render a button on the right side of the header.
    // When pressed switches the screen to edit mode.
    headerRight: (
      <Button
        title={state.params.mode === 'edit' ? 'Done' : 'Edit'}
        onPress={() => {
          setParams({ mode: state.params.mode === 'edit' ? '' : 'edit' });
        }}
      />
    ),
  };
};

const SimpleStack = StackNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Profile: {
    path: 'people/:name',
    screen: MyProfileScreen,
  },
  Photos: {
    path: 'photos/:name',
    screen: MyPhotosScreen,
  },
});

export default SimpleStack;
