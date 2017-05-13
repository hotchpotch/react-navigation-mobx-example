/**
 * @flow
 */

import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  TabRouter,
  addNavigationHelpers,
  createNavigationContainer,
  createNavigator,
} from 'react-navigation';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import React from 'react';

import SampleText from './SampleText';
import stores from './stores';

const MyNavScreen = inject('nav')(({ nav, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => {
        nav.goBack(null);
      }}
      title="Go back"
    />
  </ScrollView>
));

const MyHomeScreen = () => <MyNavScreen banner="Home Screen" />;

const MyNotificationsScreen = () => <MyNavScreen banner="Notifications Screen" />;

const MySettingsScreen = () => <MyNavScreen banner="Settings Screen" />;

const CustomTabBar = inject('customNavigationStore')(({
  customNavigationStore,
}) => {
  const { routes } = customNavigationStore.navigationState;
  return (
    <View style={styles.tabContainer}>
      {routes.map(route => (
        <TouchableOpacity
          onPress={() => customNavigationStore.navigate(route.routeName)}
          style={styles.tab}
          key={route.routeName}
        >
          <Text>{route.routeName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const CustomTabView = inject('customNavigationStore')(observer(({
  router,
  customNavigationStore,
}) => {
  const { routes, index } = customNavigationStore.navigationState;
  const navigation = addNavigationHelpers({
    dispatch: customNavigationStore.dispatchNavigation,
    state: customNavigationStore.navigationState,
  });
  const ActiveScreen = router.getComponentForState(customNavigationStore.navigationState);
  return (
    <View style={styles.container}>
      <CustomTabBar navigation={navigation} />
      <ActiveScreen
        navigation={addNavigationHelpers({
          ...navigation,
          state: routes[index],
        })}
      />
    </View>
  );
}));

const CustomTabRouter = TabRouter(
  {
    Home: {
      screen: MyHomeScreen,
      path: '',
    },
    Notifications: {
      screen: MyNotificationsScreen,
      path: 'notifications',
    },
    Settings: {
      screen: MySettingsScreen,
      path: 'settings',
    },
  },
  {
    // Change this to start on a different tab
    initialRouteName: 'Home',
  },
);

const customNavigator = createNavigator(CustomTabRouter)(CustomTabView);
stores.customNavigationStore.setNavigator(customNavigator);

autorun('CustomNavigationStore State', () => {
  console.log('customNavigationStore state', stores.customNavigationStore.navigationState);
  console.log('customNavigationStore current state', stores.customNavigationStore.state);
});

const CustomTabs = createNavigationContainer(customNavigator);

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 48,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
});

export default CustomTabs;
