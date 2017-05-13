import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider, inject } from 'mobx-react/native';
import { StackNavigator } from 'react-navigation';
import { autorun, useStrict } from 'mobx';
import { enableLogging } from 'mobx-logger';
import React, { Component } from 'react';

import Banner from './Banner';
import CustomTabs from './CustomTabs';
import Drawer from './Drawer';
import ModalStack from './ModalStack';
import SimpleStack from './SimpleStack';
import SimpleTabs from './SimpleTabs';
import StacksInTabs from './StacksInTabs';
import createNavigationContainer from './utils/createNavigationContainer';
import stores from './stores';

useStrict(true);

enableLogging({
  predicate: () => __DEV__ && Boolean(window.navigator.userAgent),
  action: true,
  transaction: true,
  reaction: true,
  compute: true,
});

const ExampleRoutes = {
  SimpleStack: {
    name: 'Stack Example',
    description: 'A card stack',
    screen: SimpleStack,
  },
  SimpleTabs: {
    name: 'Tabs Example',
    description: 'Tabs following platform conventions',
    screen: SimpleTabs,
  },
  Drawer: {
    name: 'Drawer Example',
    description: 'Android-style drawer navigation',
    screen: Drawer,
  },
  CustomTabs: {
    name: 'Custom Tabs',
    description: 'Custom tabs with tab router',
    screen: CustomTabs,
  },
  ModalStack: {
    name: Platform.OS === 'ios' ? 'Modal Stack Example' : 'Stack with Dynamic Header',
    description: Platform.OS === 'ios'
      ? 'Stack navigation with modals'
      : 'Dynamically showing and hiding the header',
    screen: ModalStack,
  },
  StacksInTabs: {
    name: 'Stacks in Tabs',
    description: 'Nested stack navigation in tabs',
    screen: StacksInTabs,
  },
  LinkStack: {
    name: 'Link in Stack',
    description: 'Deep linking into a route in stack',
    screen: SimpleStack,
    path: 'people/Jordan',
  },
  LinkTabs: {
    name: 'Link to Settings Tab',
    description: 'Deep linking into a route in tab',
    screen: SimpleTabs,
    path: 'settings',
  },
};

@inject('nav')
class MainScreen extends Component {
  render() {
    const { nav } = this.props;
    return (
      <ScrollView>
        <Banner />
        {Object.keys(ExampleRoutes).map((routeName: string) => (
          <TouchableOpacity
            key={routeName}
            onPress={() => {
              const { path, params, screen } = ExampleRoutes[routeName];
              const { router } = screen;
              const action = path && router.getActionForPathAndParams(path, params);
              nav.navigate(routeName, { 1: 2 }, action);
            }}
          >
            <View style={styles.item}>
              <Text style={styles.title}>{ExampleRoutes[routeName].name}</Text>
              <Text style={styles.description}>{ExampleRoutes[routeName].description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

const AppNavigator = StackNavigator(
  {
    ...ExampleRoutes,
    Index: {
      screen: MainScreen,
    },
  },
  {
    initialRouteName: 'Index',
    headerMode: 'none',

    /*
   * Use modal on iOS because the card mode comes from the right,
   * which conflicts with the drawer example gesture
   */
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  },
);

stores.nav.setNavigator(AppNavigator);

const AppNavigationMobx = createNavigationContainer(AppNavigator);

autorun('NavigationStore State', () => {
  console.log('navigationState', stores.nav.navigationState);
  console.log('current state', stores.nav.state);
});

class App extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        <AppNavigationMobx />
      </Provider>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  description: {
    fontSize: 13,
    color: '#999',
  },
});
