/**
 * @flow
 */

import { Button, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { inject } from 'mobx-react/native';
import React from 'react';

import SampleText from './SampleText';

const MyNavScreen = inject('nav')(({ nav, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => nav.navigate('Profile', { name: 'Jane' })}
      title="Go to a profile screen"
    />
    <Button
      onPress={() => nav.navigate('HeaderTest')}
      title="Go to a header toggle screen"
    />
    {nav.state.routeName === 'HeaderTest' &&
      <Button
        title="Toggle Header"
        onPress={() =>
          nav.setParams({
            headerVisible: !nav.state.params ||
              !nav.state.params.headerVisible,
          })}
      />}
    <Button onPress={() => nav.goBack(null)} title="Go back" />
  </ScrollView>
));

const MyHomeScreen = () => <MyNavScreen banner="Home Screen" />;
MyHomeScreen.navigationOptions = {
  title: 'Welcome',
};

const MyProfileScreen = inject('nav')(({ nav }) => (
  <MyNavScreen banner={`${nav.state.params.name}'s Profile`} />
));
MyProfileScreen.navigationOptions = ({ navigation }) => ({
  title: `${navigation.state.params.name}'s Profile!`,
});

const MyHeaderTestScreen = inject('nav')(() => (
  <MyNavScreen banner={'Full screen view'} />
));

MyHeaderTestScreen.navigationOptions = ({ navigation }) => {
  const headerVisible = navigation.state.params && navigation.state.params.headerVisible;
  return {
    header: headerVisible ? undefined : null,
    title: 'Now you see me',
  };
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
