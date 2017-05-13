/**
 * @flow
 */

import { Button, ScrollView } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { inject } from 'mobx-react/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

import SampleText from './SampleText';

const MyNavScreen = inject('nav')(({ nav, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => nav.navigate('Profile', { name: 'Jordan' })}
      title="Go to a profile screen"
    />
    <Button
      onPress={() => nav.navigate('NotifSettings')}
      title="Go to notification settings"
    />
    <Button onPress={() => nav.navigate('Settings')} title="Go to settings" />
    <Button onPress={() => nav.goBack(null)} title="Go back" />
  </ScrollView>
));

const MyHomeScreen = () => <MyNavScreen banner="Home Screen" />;

const MyProfileScreen = inject('nav')(({ nav }) => (
  <MyNavScreen banner={`${nav.state.params.name}'s Profile`} />
));
MyProfileScreen.navigationOptions = ({ navigation }) => ({
  title: `${navigation.state.params.name}'s Profile!`,
});

const MyNotificationsSettingsScreen = () => <MyNavScreen banner="Notification Settings" />;

const MySettingsScreen = () => <MyNavScreen banner="Settings" />;

const MainTab = StackNavigator({
  Home: {
    screen: MyHomeScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Welcome',
    }),
  },
  Profile: {
    screen: MyProfileScreen,
    path: '/people/:name',
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.name}'s Profile!`,
    }),
  },
});

const SettingsTab = StackNavigator({
  Settings: {
    screen: MySettingsScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Settings',
    }),
  },
  NotifSettings: {
    screen: MyNotificationsSettingsScreen,
    navigationOptions: () => ({
      title: 'Notification Settings',
    }),
  },
});

const StacksInTabs = TabNavigator(
  {
    MainTab: {
      screen: MainTab,
      path: '/',
      navigationOptions: () => ({
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      }),
    },
    SettingsTab: {
      screen: SettingsTab,
      path: '/settings',
      navigationOptions: () => ({
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      }),
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  },
);

export default StacksInTabs;
