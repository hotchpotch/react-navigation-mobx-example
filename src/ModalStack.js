/**
 * @flow
 */

import { Button, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { inject } from 'mobx-react/native';
import React from 'react';

import SampleText from './SampleText';

const MyNavScreen = inject('navigationStore')(({ navigationStore, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigationStore.navigate('Profile', { name: 'Jane' })}
      title="Go to a profile screen"
    />
    <Button
      onPress={() => navigationStore.navigate('HeaderTest')}
      title="Go to a header toggle screen"
    />
    {navigationStore.state.routeName === 'HeaderTest' &&
    <Button
      title="Toggle Header"
      onPress={() => navigationStore.setParams({
        header: navigationStore.state.params &&
                navigationStore.state.params.header === 'visible'
                ? 'none'
                : 'visible',
      })}
    />}
    <Button onPress={() => navigationStore.goBack(null)} title="Go back" />
  </ScrollView>
  ));

const MyHomeScreen = () => <MyNavScreen banner="Home Screen" />;
MyHomeScreen.navigationOptions = {
  title: 'Welcome',
};

const MyProfileScreen = inject('navigationStore')(({ navigationStore }) => (
  <MyNavScreen banner={`${navigationStore.state.params.name}'s Profile`} />
));
MyProfileScreen.navigationOptions = {
  title: ({ state }) => `${state.params.name}'s Profile!`,
};

const MyHeaderTestScreen = () => <MyNavScreen banner={'Full screen view'} />;
MyHeaderTestScreen.navigationOptions = {
  header: ({ state }) => ({
    visible: !!state.params && state.params.header === 'visible',
    title: 'Now you see me',
  }),
};

const ModalStack = StackNavigator(
  {
    Home: {
      screen: MyHomeScreen,
    },
    Profile: {
      path: 'people/:name',
      screen: MyProfileScreen,
    },
    HeaderTest: { screen: MyHeaderTestScreen },
  },
  {
    mode: 'modal',
  },
);

export default ModalStack;
